// TODO: fix tests

// import { BitString } from './BitString';

// describe('BitString', () => {
//   it('should be instantiable', () => {
//     const bitstring = new BitString();
//     expect(bitstring).toBeDefined();
//   });

//   it('should produce strings', () => {
//     const bitstring = new BitString();
//     bitstring.addBit(1);
//     expect(bitstring.toString()).toBe('1');
//     bitstring.addBit(0);
//     expect(bitstring.toString()).toBe('10');
//     expect(new BitString('010101').toString()).toBe('010101');
//   });

//   it('should be convertible to byte array', () => {
//     expect(new BitString('10000000').toByteArray()[0]).toBe(128);
//     const bitstring = new BitString();
//     bitstring.addBit(1);
//     bitstring.addBit(0);
//     expect(bitstring.toByteArray()[0]).toBe(2);
//     expect(new BitString('100000001').toByteArray()[1]).toBe(1);
//     expect(new BitString('100000001').toByteArray()[0]).toBe(128);
//   });

//   it('should be mutable', () => {
//     const bitstring = new BitString('111');
//     bitstring.mutate(1.0);
//     expect(bitstring.toString()).toEqual('000');
//     bitstring.mutate(0);
//     expect(bitstring.toString()).toEqual('000');
//   });

//   it('should only be mutable by valid probabilities', () => {
//     const bitstring = new BitString('10');
//     bitstring.mutate(1.0);
//     bitstring.mutate(0);
//     bitstring.mutate(0.5);
//     expect(() => bitstring.mutate(1.00000001)).toThrow(
//       new Error('Mutation chance is not a valid probability'),
//     );
//     expect(() => bitstring.mutate(-0.00000001)).toThrow(
//       new Error('Mutation chance is not a valid probability'),
//     );
//   });

//   it('should be mutable parents of different length', () => {
//     const parentA = new BitString('010');
//     const parentB = new BitString('101');
//     const children = new BitString('10').crossover(parentA);
//     expect(children[1].toString().length).toEqual(parentA.toString().length);
//     expect(() => parentA.crossover(parentB, 4)).toThrow(
//       new Error('Invalid number of crossover points'),
//     );
//     expect(() => parentA.crossover(parentB, 0)).toThrow(
//       new Error('Invalid number of crossover points'),
//     );
//   });
// });
