import { Pipe, PipeTransform } from '@angular/core';
import { Proizvod } from './shared/proizvod';

@Pipe({
  name: 'productFilter'
})
export class ProductFilterPipe implements PipeTransform {
  transform(products: Proizvod[], searchName: string, sort: string): Proizvod[] {
    let filteredProducts = products;

    // Filtriranje
    if (searchName) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Sortiranje
    switch (sort) {
      case 'priceAsc':
        return filteredProducts.sort((a, b) => a.price - b.price);
      case 'priceDesc':
        return filteredProducts.sort((a, b) => b.price - a.price);
      default:
        return filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
  }
}



