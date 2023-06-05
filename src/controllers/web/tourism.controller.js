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
    const localPath = req.file.path
    const destinationFileName = generateRandomFileName(req.file.originalname)

    await bucket.upload(localPath, {
      destination: `places/${destinationFileName}`
    })

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