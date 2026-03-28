export class Promocode {
  id: string;
  code: string;
  discount: number;
  activationLimit: number;
  expirationDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
