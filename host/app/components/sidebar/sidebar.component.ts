// sidebar.component.ts
import { permissionsSignal } from './../../interfaces/Permissions';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  expanded?: boolean;
  children?: SubMenuItem[];
}

interface SubMenuItem {
  label: string;
  route?: string;
  expanded?: boolean;
  children?: SubMenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class SidebarComponent implements OnInit {
  collapsed = true;
  menuItems: MenuItem[] = [];
  isInteracting = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.buildMenuFromPermissions();
  }

  onSidebarMouseEnter() {
    this.collapsed = false;
  }

  onSidebarMouseLeave() {
    if (!this.isInteracting) {
      this.collapsed = true;
      this.collapseAllMenus();
    }
  }

  buildMenuFromPermissions() {
    this.menuItems = [
      {
        label: 'Inicio',
        icon: 'home.svg',
        route: '/',
      },
    ];

    const permissions = permissionsSignal();
    if (!permissions || permissions.length === 0) return;

    const adminConsole = permissions.flatMap((p) =>
      p.permissions.flatMap((perm) =>
        perm.aplications.filter(
          (app) => app.nameAplication.trim() === 'Consola Administrativa'
        )
      )
    )[0];

    if (!adminConsole?.modules) return;

    const directorioItem: MenuItem = {
      label: 'Directorio',
      icon: 'config.svg',
      expanded: false,
      children: [],
    };

    adminConsole.modules.forEach((module) => {
      const moduleName = module.nameModule.trim();

      if (!module.subModules || module.subModules.length === 0) {
        directorioItem.children?.push({
          label: moduleName,
          route: this.generateRouteFromName(moduleName),
          expanded: false,
        });
        return;
      }

      const moduleItem: SubMenuItem = {
        label: moduleName,
        expanded: false,
        children: [],
      };

      module.subModules.forEach((subModule) => {
        const subModuleName = subModule.nameSubModule.trim();
        moduleItem.children?.push({
          label: subModuleName,
          route: this.generateRouteFromName(moduleName, subModuleName),
        });
      });

      directorioItem.children?.push(moduleItem);
    });

    if (directorioItem.children?.length) {
      this.menuItems.push(directorioItem);
    }
  }

  private generateRouteFromName(moduleName: string, subModuleName?: string): string {
    const baseRoute = moduleName
      .toLowerCase()
      .normalize('NFD')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    if (!subModuleName) return baseRoute;

    const subRoute = subModuleName
      .toLowerCase()
      .normalize('NFD')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    return `${baseRoute}/${subRoute}`;
  }

  toggleSubMenu(item: MenuItem | SubMenuItem, parentItems?: (MenuItem | SubMenuItem)[]) {
    this.isInteracting = true;

    if (item.children) {
      // Si hay un array de padres, colapsa solo los hermanos
      if (parentItems) {
        parentItems.forEach(sibling => {
          if (sibling !== item) sibling.expanded = false;
        });
      } else {
        // Si es menú de primer nivel, colapsa los otros menús principales
        this.menuItems.forEach(menuItem => {
          if (menuItem !== item) menuItem.expanded = false;
        });
      }
      item.expanded = !item.expanded;
    } else if (item.route) {
      this.navigateTo(item.route);
    }
  }


  private collapseAllMenus() {
    this.menuItems.forEach(item => {
      item.expanded = false;
      if (item.children) {
        item.children.forEach(child => child.expanded = false);
      }
    });
  }

  navigateTo(route?: string): void {
    if (route) {
      this.router.navigate([route]);
    }
    setTimeout(() => this.isInteracting = false, 300);
  }

  isActive(route?: string): boolean {
    return route ? this.router.isActive(route, true) : false;
  }
}
