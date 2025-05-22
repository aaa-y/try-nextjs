/**
 * Base interface for all entities in the domain
 * 
 * In DDD, entities:
 * - Have a unique identity
 * - Are mutable
 * - Represent domain concepts with continuity and identity
 * 
 * @template T The type of the entity's identifier
 */
export interface Entity<T> {
  /**
   * The unique identifier of the entity
   */
  readonly id: T;
}
