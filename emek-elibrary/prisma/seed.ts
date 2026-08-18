import { PrismaClient, AccessLevel, ContentType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "Theology", slug: "theology", description: "Systematic and biblical theology." },
    { name: "Church History", slug: "church-history", description: "History of the Christian church." },
    { name: "Biblical Studies", slug: "biblical-studies", description: "Commentaries and original language study." },
    { name: "Devotional & Christian Life", slug: "devotional", description: "Discipleship, prayer, and Christian living." },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const theology = await prisma.category.findUniqueOrThrow({ where: { slug: "theology" } });
  const churchHistory = await prisma.category.findUniqueOrThrow({ where: { slug: "church-history" } });

  const institutes = await prisma.book.upsert({
    where: { id: "seed-institutes-christian-religion" },
    update: {},
    create: {
      id: "seed-institutes-christian-religion",
      title: "Institutes of the Christian Religion",
      author: "John Calvin",
      description:
        "Calvin's foundational systematic theology, tracing the knowledge of God, humanity, redemption, and the Christian life.",
      language: "en",
      publishedYear: 1559,
      pageCount: 3,
      contentType: ContentType.PAGE_IMAGES,
      accessLevel: AccessLevel.PUBLIC,
      categoryId: theology.id,
      pages: {
        create: [
          { pageNumber: 1, textContent: "Book One: The Knowledge of God the Creator." },
          { pageNumber: 2, textContent: "Chapter I: The knowledge of God and that of ourselves are connected." },
          { pageNumber: 3, textContent: "Without knowledge of self there is no knowledge of God." },
        ],
      },
    },
  });

  await prisma.book.upsert({
    where: { id: "seed-confessions" },
    update: {},
    create: {
      id: "seed-confessions",
      title: "Confessions",
      author: "Augustine of Hippo",
      description: "Augustine's autobiographical account of his conversion and early life, addressed as a prayer to God.",
      language: "en",
      publishedYear: 398,
      pageCount: 2,
      contentType: ContentType.PAGE_IMAGES,
      accessLevel: AccessLevel.PUBLIC,
      categoryId: churchHistory.id,
      pages: {
        create: [
          { pageNumber: 1, textContent: "Great art thou, O Lord, and greatly to be praised." },
          { pageNumber: 2, textContent: "Thou hast made us for thyself, and our heart is restless until it repose in thee." },
        ],
      },
    },
  });

  console.log("Seed complete:", institutes.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
