import { Component,ChangeDetectionStrategy } from '@angular/core';
import { catchError, combineLatest, EMPTY, filter, map, startWith, Subject} from 'rxjs';

import { ProductCategory } from '../product-categories/product-category';
import { ProductCategoryService } from '../product-categories/product-category.service';

import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ProductListComponent{
  pageTitle = 'Product List';
  errorMessage = '';
  categories: ProductCategory[] = [];
  selectedCategoryId=1;

  private categorySelectedSubject = new Subject<number>();
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  products$= combineLatest([
    this.productService.productsWithCategory$,
    this.categorySelectedAction$
     .pipe(
      startWith(0)
     )
  ])
    .pipe(
      map(([products,selectedCategoryId])=>
        products.filter(product =>
          selectedCategoryId?product.categoryId === selectedCategoryId :true
        )),
        catchError((err) => {
          this.errorMessage=err;
          return EMPTY;
        })
    )

 

  categories$=this.productCategoryService.productCategories$
  .pipe(
    catchError((err) => {
      this.errorMessage=err;
     // return of([])
     return EMPTY;
    })
  );




  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) { }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId)
  }
}
