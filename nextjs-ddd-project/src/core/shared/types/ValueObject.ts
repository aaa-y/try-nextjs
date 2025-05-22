/**
 * Base interface for all value objects in the domain
 * 
 * In DDD, value objects:
 * - Have no identity
 * - Are immutable
 * - Are defined by their attributes
 * - Can be replaced rather than modified
 * 
 * @template T The type of the value object's value
 */
export interface ValueObject<T> {
  /**
   * The value of the value object
   */
  readonly value: T;

  /**
   * Checks if this value object is equal to another
   * @param other The other value object to compare with
   */
  equals(other: ValueObject<T>): boolean;
}
