// location.model.ts
export interface Country {
  pais: string;
  departamentos: Department[];
}

export interface Department {
  nombre: string;
  ciudades: string[];
}

// location.mock.ts
export const LocationMock = {
  countriesMock: [
    {
      pais: 'Colombia',
      departamentos: [
        {
          nombre: 'Bogotá D.C.',
          ciudades: ['Bogotá']
        },
        {
          nombre: 'Antioquia',
          ciudades: ['Medellín', 'Rionegro']
        }
      ]
    },
    {
      pais: 'Perú',
      departamentos: [
        {
          nombre: 'Lima',
          ciudades: ['Lima']
        },
        {
          nombre: 'Cusco',
          ciudades: ['Cusco']
        }
      ]
    }
  ]
};
