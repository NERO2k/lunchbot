export default interface Menu {
  menu: { [key: string]: Array<string> };
  schema_version: number;
  listed_week: number;
  actual_week: number;
  actual_year: number;
}
