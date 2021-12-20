import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { IProduct } from "./product";
import { ProductService } from "./product.service";

@Component({
    templateUrl: "./product-list.component.html",
    styleUrls: ["./product-list.component.css"]
})
export class ProductListComponent implements OnInit, OnDestroy {
    pageTitle: string = "Product List";
    imageWidth: number = 50;
    imageMargin: number = 2;
    showImage: boolean = false;
    errorMessage: string = "";
    private _listFilter: string = "";
    sub!: Subscription;
    get listFilter(): string
    {
        return this._listFilter;
    }
    set listFilter(value: string)
    {
        this._listFilter = value;
        this.filteredProducts = this.performFilter(value); // при изменении строки поиска вызывать метод фильтрации
    }

    filteredProducts: IProduct[] = [];
    products: IProduct[] = [];

    constructor(private productService: ProductService){}

    performFilter(filterBy: string): IProduct[]{
        filterBy = filterBy.toLocaleLowerCase();    //получаем строку из поиска и кидаём её в нижний регистр
        return this.products.filter((product: IProduct) =>
        product.productName.toLowerCase().includes(filterBy)); //возвращаем слова в которых присутствуют введённые символы
    }

    toggleImage(): void{
        this.showImage = !this.showImage;
    }

    ngOnInit(): void {
        this.sub = this.productService.getProducts().subscribe({
            next: products => 
            {
                this.products = products;
                this.listFilter = '';
            },    
            error: err => this.errorMessage = err
        });
        
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    onRatingClicked(message: string): void
    {
        this.pageTitle = "Product List: " + message;
    }
}