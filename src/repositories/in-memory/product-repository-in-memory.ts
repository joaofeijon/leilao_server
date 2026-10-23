import { randomUUID } from "node:crypto";
import { Prisma, Product } from "@prisma/client";
import { ProductRepository } from "../product-repository";

export class ProductRepositoryInMemory implements ProductRepository {
  public items: Product[] = [];

  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    const product: Product = {
      id: data.id ?? randomUUID(),
      title: data.title,
      name: data.name,
      description: data.description,
      initialValue: data.initialValue,
      createdAt: new Date(),
    };

    this.items.push(product);

    return product;
  }

  async findById(id: string): Promise<Product | null> {
    const product = this.items.find((item) => item.id === id);

    return product || null;
  }

  async findMany(): Promise<Product[]> {
    return this.items;
  }

  async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    const index = this.items.findIndex((item) => item.id === id);

    // igual ao Prisma: campos undefined nao sao alterados
    const fields = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<Product>;

    this.items[index] = { ...this.items[index], ...fields };

    return this.items[index];
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== id);
  }
}
