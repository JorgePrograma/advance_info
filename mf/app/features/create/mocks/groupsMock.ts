import { GroupModel } from "../model/group.model";

export const GROUPS_MOCK: GroupModel[] = [
  {
    id: 'GRP-001',
    name: 'Recursos Humanos',
    description: 'Grupo encargado de gestión del personal',
    type: 'department'
  },
  {
    id: 'GRP-002',
    name: 'Equipo de Desarrollo Frontend',
    description: 'Equipo especializado en Angular y tecnologías web',
    type: 'team'
  },
  {
    id: 'GRP-003',
    name: 'Comité de Seguridad',
    description: 'Grupo responsable de políticas de seguridad informática',
    type: 'committee'
  },
  {
    id: 'GRP-004',
    name: 'Proyecto Mobile',
    description: 'Grupo temporal para desarrollo de aplicación móvil',
    type: 'project'
  },
  {
    id: 'GRP-005',
    name: 'Soporte Técnico',
    description: 'Equipo de asistencia técnica a usuarios',
    type: 'support'
  }
];
