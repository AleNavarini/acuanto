import { CarSale, CarModel } from '@prisma/client';

export interface CarSaleWithModel extends CarSale {
  carModel: CarModel;
}