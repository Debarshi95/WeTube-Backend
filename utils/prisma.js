const { PrismaClient } = require('@prisma/client')
const { categoriesOnVideo } = require('../prisma/seeders/categoryOnVideo')
const { videos } = require('../prisma/seeders/video')
const { categories } = require('../prisma/seeders/categories')

const prisma = new PrismaClient()
async function main() {
  // const a = await prisma.video.createMany({
  //   data: videos,
  // });
  // const b = await prisma.category.createMany({
  //   data: categories,
  // });
  // const res = await prisma.categoriesOnVideo.createMany({
  //   data: categoriesOnVideo,
  // });
  // console.log({ res });
}
main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
module.exports = prisma
