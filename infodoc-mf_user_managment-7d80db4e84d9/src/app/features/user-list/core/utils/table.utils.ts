import { FormControl } from '@angular/forms';
import { signal, computed } from '@angular/core';

export interface TableConfig<T> {
  data: T[];
  pageSize?: number;
  currentPage?: number;
  searchControl?: FormControl;
  statusFilter?: FormControl<string[]>;
}

export function createTableState<T>(config: TableConfig<T>) {
  const pageSize = signal(config.pageSize || 10);
  const currentPage = signal(config.currentPage || 1);
  const searchControl = config.searchControl || new FormControl('');
  const statusFilter = config.statusFilter || new FormControl<string[]>([]);

  const filteredData = computed(() => {
    const searchTerm = searchControl.value?.toLowerCase() || '';
    const statuses = statusFilter.value || [];

    return config.data.filter(item => {
      // Filtro por búsqueda (debe ser implementado según el tipo T)
      const matchesSearch = true; // Implementar lógica específica

      // Filtro por estado
      const matchesStatus = statuses.length === 0 ||
        (item as any).state && statuses.includes((item as any).state);

      return matchesSearch && matchesStatus;
    });
  });

  const paginatedData = computed(() => {
    const start = (currentPage() - 1) * pageSize();
    const end = start + pageSize();
    return filteredData().slice(start, end);
  });

  return {
    pageSize,
    currentPage,
    searchControl,
    statusFilter,
    filteredData,
    paginatedData,
    totalItems: computed(() => filteredData().length)
  };
}
