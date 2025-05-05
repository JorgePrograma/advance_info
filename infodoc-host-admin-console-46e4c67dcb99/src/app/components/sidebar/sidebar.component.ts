import { permissionsSignal } from './../../interfaces/Permissions';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

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
  constructor(private router: Router) {}
  isInteracting = false;

  onSidebarMouseLeave() {
    if (!this.isInteracting) {
      this.collapsed = true;
    }
  }


  ngOnInit() {
    this.buildMenuFromPermissions();
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

  private generateRouteFromName(
    moduleName: string,
    subModuleName?: string
  ): string {
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

  toggleSubMenu(item: MenuItem | SubMenuItem) {
    // Solo manejar expansión si el item tiene hijos
    if ('children' in item) {
      // Colapsar otros menús abiertos
      this.collapseOtherMenus(item);
      // Alternar estado del menú actual
      item.expanded = !item.expanded;
      this.isInteracting = item.expanded;
    } else if (item.route) {
      this.navigateTo(item.route);
    }
  }

  private collapseOtherMenus(currentItem: MenuItem | SubMenuItem) {
    // Colapsar todos los menús excepto el actual
    this.menuItems.forEach(menuItem => {
      if (menuItem !== currentItem) {
        menuItem.expanded = false;
        if (menuItem.children) {
          menuItem.children.forEach(child => {
            child.expanded = false;
          });
        }
      }
    });
  }

  navigateTo(route: string | undefined): void {
    if (route) {
      this.router.navigate([route]);
    }
  }
}
