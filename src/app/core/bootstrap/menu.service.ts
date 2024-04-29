import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { share } from 'rxjs/operators';

export interface MenuTag {
  color: string; // background color
  value: string;
}

export interface MenuPermissions {
  only?: string | string[];
  except?: string | string[];
}

export interface MenuChildrenItem {
  route: string;
  name: string;
  type: 'link' | 'sub' | 'extLink' | 'extTabLink';
  children?: MenuChildrenItem[];
  permissions?: MenuPermissions;
}

export interface Menu {
  route: string;
  name: string;
  type: 'link' | 'sub' | 'extLink' | 'extTabLink';
  icon: string;
  label?: MenuTag;
  badge?: MenuTag;
  children?: MenuChildrenItem[];
  permissions?: MenuPermissions;
}

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private menu$: BehaviorSubject<Menu[]> = new BehaviorSubject<Menu[]>([]);

  /** Get all the menu data. */
  getAll(): Observable<Menu[]> {
    return this.menu$.asObservable();
  }

  /** Observe the change of menu data. */
  change(): Observable<Menu[]> {
    return this.menu$.pipe(share());
  }

  /** Initialize the menu data. */
  set(menu: Menu[], roles: any): Observable<Menu[]> {
    const menuFiltrado = this.filterMenu(menu, roles);
    this.menu$.next(menuFiltrado);
    return this.menu$.asObservable();
  }

  /** Add one item to the menu data. */
  add(menu: Menu) {
    const tmpMenu = this.menu$.value;
    tmpMenu.push(menu);
    this.menu$.next(tmpMenu);
  }

  /** Reset the menu data. */
  reset() {
    this.menu$.next([]);
  }

  /** Delete empty values and rebuild route. */
  buildRoute(routeArr: string[]): string {
    let route = '';
    routeArr.forEach(item => {
      if (item && item.trim()) {
        route += '/' + item.replace(/^\/+|\/+$/g, '');
      }
    });
    return route;
  }

  /** Get the menu item name based on current route. */
  getItemName(routeArr: string[]): string {
    return this.getLevel(routeArr)[routeArr.length - 1];
  }

  // Whether is a leaf menu
  private isLeafItem(item: MenuChildrenItem): boolean {
    const cond0 = item.route === undefined;
    const cond1 = item.children === undefined;
    const cond2 = !cond1 && item.children?.length === 0;
    return cond0 || cond1 || cond2;
  }

  // Deep clone object could be jsonized
  private deepClone(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }

  // Whether two objects could be jsonized equal
  private isJsonObjEqual(obj0: any, obj1: any): boolean {
    return JSON.stringify(obj0) === JSON.stringify(obj1);
  }

  // Whether routeArr equals realRouteArr (after remove empty route element)
  private isRouteEqual(routeArr: Array<string>, realRouteArr: Array<string>): boolean {
    realRouteArr = this.deepClone(realRouteArr);
    realRouteArr = realRouteArr.filter(r => r !== '');
    return this.isJsonObjEqual(routeArr, realRouteArr);
  }

  /** Get the menu level. */
  getLevel(routeArr: string[]): string[] {
    let tmpArr: any[] = [];
    this.menu$.value.forEach(item => {
      // Breadth-first traverse
      let unhandledLayer = [{ item, parentNamePathList: [], realRouteArr: [] }];
      while (unhandledLayer.length > 0) {
        let nextUnhandledLayer: any[] = [];
        for (const ele of unhandledLayer) {
          const eachItem = ele.item;
          const currentNamePathList = this.deepClone(ele.parentNamePathList).concat(eachItem.name);
          const currentRealRouteArr = this.deepClone(ele.realRouteArr).concat(eachItem.route);
          // Compare the full Array for expandable
          if (this.isRouteEqual(routeArr, currentRealRouteArr)) {
            tmpArr = currentNamePathList;
            break;
          }
          if (!this.isLeafItem(eachItem)) {
            const wrappedChildren = eachItem.children?.map(child => ({
              item: child,
              parentNamePathList: currentNamePathList,
              realRouteArr: currentRealRouteArr,
            }));
            nextUnhandledLayer = nextUnhandledLayer.concat(wrappedChildren);
          }
        }
        unhandledLayer = nextUnhandledLayer;
      }
    });
    return tmpArr;
  }

  /** Add namespace for translation. */
  addNamespace(menu: Menu[] | MenuChildrenItem[], namespace: string) {
    menu.forEach(menuItem => {
      menuItem.name = `${namespace}.${menuItem.name}`;
      if (menuItem.children && menuItem.children.length > 0) {
        this.addNamespace(menuItem.children, menuItem.name);
      }
    });
  }

  // private filterMenu(menu: (Menu | MenuChildrenItem)[], roles: string[]): Menu[] {
  //   const filteredMenu: Menu[] = [];

  //   menu.forEach(item => {
  //     if (item) {
  //       const permissions = (item as Menu).permissions as string[];
  //       if (roles && permissions && Array.isArray(roles) && Array.isArray(permissions)) {
  //         const intersection = permissions.filter(permission => roles.includes(permission));
  //         if (intersection.length > 0) {
  //           if (item.children && item.children.length > 0) {
  //             const filteredChildren = this.filterMenu(item.children, roles);
  //             if (filteredChildren.length > 0) {
  //               const menuItem = { ...item, children: filteredChildren };
  //               filteredMenu.push(menuItem as Menu);
  //             }
  //           } else {
  //             filteredMenu.push(item as Menu);
  //           }
  //         }
  //       }
  //     }
  //   });

  //   return filteredMenu;
  // }


  private filterMenu(menu: (Menu | MenuChildrenItem)[], roles: string[]): Menu[] {
    const filteredMenu: Menu[] = [];

    menu.forEach(item => {
      const filteredItem = this.filterMenuItem(item, roles);
      if (filteredItem) {
        filteredMenu.push(filteredItem);
      }
    });

    return filteredMenu;
  }

  private filterMenuItem(item: Menu | MenuChildrenItem, roles: string[]): Menu | null {
    if (item) {
      const permissions = (item as Menu).permissions as string[];
      if (roles && permissions && Array.isArray(roles) && Array.isArray(permissions)) {
        const intersection = permissions.filter(permission => roles.includes(permission));
        if (intersection.length > 0) {
          const children = (item as Menu).children;
          if (children && children.length > 0) {
            const filteredChildren = this.filterMenu(children, roles);
            if (filteredChildren.length > 0) {
              return { ...item, children: filteredChildren } as Menu;
            }
          } else {
            return item as Menu;
          }
        }
      }
    }
    return null;
  }





}
