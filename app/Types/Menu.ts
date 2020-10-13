export default interface Menu {
  menu: { [key: string]: Array<string> };
  schema_version: number;
  listed_week: number | undefined;
  actual_week: number | undefined;
  actual_year: number | undefined;
  iteration_week: number | undefined;
  iteration_year: number | undefined;
}
