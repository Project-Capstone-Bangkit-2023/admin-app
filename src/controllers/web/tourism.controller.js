const path = require('path')
const fs = require('fs')
const { Storage } = require('@google-cloud/storage')
const { PrismaClient } = require('@prisma/client')

const bucketName = process.env.BUCKET_NAME
const gcloudProject = process.env.GCLOUD_PROJECT_ID
const serviceAccountEmail = process.env.GCLOUD_SERVICE_ACCOUNT_EMAIL
const keyFile = path.join(__dirname, '..', '..', '..', 'service-account.json')

const prisma = new PrismaClient()
const storage = new Storage({
  projectId: gcloudProject,
  keyFilename: keyFile,
})

exports.getTourisms = async (req, res) => {
  try {
    const tourisms = await prisma.tourism.findMany()
    res.render('tourisms/index', {
      tourisms,
    })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'An error has occured.',
      error: err.message,
    })
  }
}

exports.createTourism = async (req, res) => {
  try {

    const bucket = storage.bucket(bucketName)
    let destinationFileName = 'default.png';
    if (typeof req.file != 'undefined') {
      const localPath = req.file.path
      destinationFileName = generateRandomFileName(req.file.originalname)

      await bucket.upload(localPath, {
        destination: `places/${destinationFileName}`
      })
    }
    const tourism = await prisma.tourism.create({
      data: {
        name: req.body.name,
        picture: destinationFileName,
        description: req.body.description,
        category: req.body.category,
        city: req.body.city,
        price: Number(req.body.price),
        rating: 0,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      }
    })

    res.redirect('/tourisms')
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'An error has occured.',
      error: err.message
    })
  }
}

exports.editTourism = async (req, res) => {
  try {
    const tourism = await prisma.tourism.findUnique({
      where: {
        id: Number(req.params.tourismId)
      }
    })
    res.render('tourisms/form', {
      tourism,
    })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'An error has occured.',
      error: err.message,
    })
  }
}

exports.updateTourism = async (req, res) => {
  try {

    const findTourism = await prisma.tourism.findUnique({ where: { id: Number(req.params.tourismId) } });
    const bucket = storage.bucket(bucketName)
    let destinationFileName = findTourism.picture;
    if (typeof req.file != 'undefined' && findTourism.picture != 'default.png') {
      const localPath = req.file.path
      destinationFileName = generateRandomFileName(req.file.originalname)
      await bucket.file(`places/${findTourism.picture}`).delete();
      await bucket.upload(localPath, {
        destination: `places/${destinationFileName}`
      })
    }

    const tourism = await prisma.tourism.update({
      where: { id: Number(req.params.tourismId) },
      data: {
        name: req.body.name,
        picture: destinationFileName,
        description: req.body.description,
        category: req.body.category,
        city: req.body.city,
        price: Number(req.body.price),
        rating: 0,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      }
    })

    res.redirect('/tourisms')
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'An error has occured.',
      error: err.message
    })
  }
}

exports.deleteTourism = async (req, res) => {
  try {

    const bucket = storage.bucket(bucketName)

    const deleteTourism = await prisma.tourism.delete({
      where: {
        id: Number(req.params.tourismId),
      },
    });
    if (deleteTourism.picture != 'default.png') {
      await bucket.file(`places/${deleteTourism.picture}`).delete();
    }

    res.redirect('/tourisms')
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'An error has occured.',
      error: err.message
    })
  }
}

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random name for the file
function generateRandomFileName(originalFilename) {
  const timestamp = Date.now().toString();
  const randomNum = generateRandomNumber(1000, 9999);
  const ext = path.extname(originalFilename);
  const fileName = `${timestamp}-${randomNum}${ext}`;
  return fileName;
}