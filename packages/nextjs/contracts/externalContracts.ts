import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

/**
 * @example
 * const externalContracts = {
 *   1: {
 *     DAI: {
 *       address: "0x...",
 *       abi: [...],
 *     },
 *   },
 * } as const;
 */

const externalContracts = {
  545: {
    HelloWorld: {
      address: "0xEab71077e3a7a3385dE1BE06214929413668c639",
      abi: [
        {
          inputs: [],
          name: "hello",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "newGreeting",
              type: "string",
            },
          ],
          name: "changeGreeting",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
    },
  },
} as const;

// const externalContracts = {} as const;

export default externalContracts satisfies GenericContractsDeclaration;
