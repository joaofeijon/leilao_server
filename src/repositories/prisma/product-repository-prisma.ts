import { Prisma, type Product } from '@prisma/client';
import { ProductRepository } from '../product-repository';
import { prisma } from '@/lib/prisma';

export class ProductRepositoryPrisma implements ProductRepository {
  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    const product = await prisma.product.create({ data })

    return product
  }

  async findById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({ where: { id } })

    return product
  }

  async findMany(): Promise<Product[]> {
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } })

    return products
  }

  async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    const product = await prisma.product.update({ where: { id }, data })

    return product
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } })
  }
}
