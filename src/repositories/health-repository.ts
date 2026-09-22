export interface HealthRepository {
  checkDatabase(): Promise<boolean>
}
