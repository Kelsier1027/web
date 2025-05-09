export interface LocalStorageCacheType {
    key: string;
    expireSeconds: number;
}

export class CustomerInfoCache implements LocalStorageCacheType {
    key = 'customer-info-cache';
    expireSeconds = 300;
}

export class MenuCache implements LocalStorageCacheType {
    key = 'menu-cache';
    expireSeconds = 600;
}

export class FlashSaleCache implements LocalStorageCacheType {
    key = 'flash-sale-cache';
    expireSeconds = 300;
}
export class HomePageBannersCache implements LocalStorageCacheType {
    key = 'homepage-banners-cache';
    expireSeconds = 300;
}
export class AwardActivityCache implements LocalStorageCacheType {
    key = 'award-activity-cache';
    expireSeconds = 300;
}
export class PeriodSaleCache implements LocalStorageCacheType {
    key = 'period-sale-cache';
    expireSeconds = 300;
}
export class ClearanceSaleCache implements LocalStorageCacheType {
    key = 'clearance-sale-cache';
    expireSeconds = 300;
}
export class PrimePromosCache implements LocalStorageCacheType {
    key = 'prime-promos-cache';
    expireSeconds = 300;
}
export class HotSalesCache implements LocalStorageCacheType {
    key = 'hot-sales-cache';
    expireSeconds = 300;
}

export class GuessYouLikeCache implements LocalStorageCacheType {
    key = 'guess-you-like-cache';
    expireSeconds = 600;
}

export class RecommendedCache implements LocalStorageCacheType {
    key = 'recommended-cache';
    expireSeconds = 600;
}

export class ProductDetailCache implements LocalStorageCacheType {
    key = `item-0-cache`;
    expireSeconds = 60;

    constructor(itemId: number) {
        this.key = `item-${itemId}-cache`;
    }
}

export const LOCAL_STORAGE_CACHE = {
    customerInfo: new CustomerInfoCache(),
    menu: new MenuCache(),
    flashSale: new FlashSaleCache(),
    homePageBanners: new HomePageBannersCache(),
    awardActivity: new AwardActivityCache(),
    periodSale: new PeriodSaleCache(),
    clearanceSale: new ClearanceSaleCache(),
    primePromos: new PrimePromosCache(),
    hotSales: new HotSalesCache(),
    guessYouLike: new GuessYouLikeCache(),
    recommended: new RecommendedCache(),

    productDetailCaches: [],

    Invalidate(type: LocalStorageCacheType) {
        localStorage.removeItem(type.key);
    },

    InvalidateAllCaches() {
        this.Invalidate(this.customerInfo);  
        this.Invalidate(this.menu);
        this.Invalidate(this.flashSale);
        this.Invalidate(this.homePageBanners);
        this.Invalidate(this.awardActivity);
        this.Invalidate(this.periodSale);
        this.Invalidate(this.clearanceSale);
        this.Invalidate(this.primePromos);
        this.Invalidate(this.hotSales);
        this.InvalidateAllProductDetails();
    },

    InvalidateAllProductDetails() {
        this.productDetailCaches.forEach(c => {
            this.Invalidate(c);
        });

        this.productDetailCaches = [];

        this.Invalidate(this.guessYouLike);
        this.Invalidate(this.recommended);
    },

    AddOrUpdate(type: LocalStorageCacheType, object: any) {
        this.Invalidate(type);

        let expireAt = new Date();
        expireAt.setSeconds(expireAt.getSeconds() + type.expireSeconds);

        localStorage.setItem(type.key, JSON.stringify({content: object, expireAt}));
    },

    GetCacheOrNull<T>(type: LocalStorageCacheType): T | null {
        const json = localStorage.getItem(type.key);

        if (!json)
            return null;

        const result = JSON.parse(json) as { content: T, expireAt: string }; // parse 會把 expireAt 變成字串..

        const isExpired = new Date(result.expireAt) < new Date();
        
        if (isExpired){
            this.Invalidate(type);
            return null;
        }

        return result?.content;
    }
}