// ABI for the HelloWorld contract
export const contractABI = [
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
];
