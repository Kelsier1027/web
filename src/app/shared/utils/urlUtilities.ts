import { ActivatedRoute, ActivatedRouteSnapshot, Params, RouterStateSnapshot } from "@angular/router";

export const URL_UTIL = {
  getParam(currentRoute: ActivatedRouteSnapshot | Params, paramName: string): any {
    return currentRoute instanceof ActivatedRouteSnapshot
      ? currentRoute.queryParams[paramName]
      : currentRoute[paramName];
  },

    getDealerView(currentRoute: ActivatedRouteSnapshot | Params ): string | null {
        return this.getParam(currentRoute, 'dealerView') as string | null;
    },

    canUseDealerView(currentRoute: RouterStateSnapshot | string): boolean {
        const supportedRoutes = ['/productlist', '/product', '/member/bonus', '/member/order', '/member/bill'];
        
        const url = currentRoute instanceof RouterStateSnapshot 
          ? currentRoute.url.toLowerCase()
          : currentRoute.toLowerCase();

        const result = supportedRoutes.some(r => url.startsWith(r));

        return result;
    }
  }