export interface GroupModel {
  id:           string;
  title:        string;
  description:  string;
  dateCreation: Date;
  state:        string;
  users:        User[];
}

export interface User {
  id:    string;
  name:  string;
  state: string;
}
