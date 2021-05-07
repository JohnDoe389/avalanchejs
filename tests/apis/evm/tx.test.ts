import { 
  ImportTx, 
  SECPTransferInput, 
  TransferableInput 
} from 'src/apis/evm';
import { Defaults, MILLIAVAX } from 'src/utils/constants';
import { ONEAVAX } from '../../../src/utils/constants';
import { EVMOutput } from 'src/apis/evm';
import BN from "bn.js";
import { 
  BinTools,
  Buffer 
} from 'src';
const networkID: number = 12345;
const cHexAddress1: string = "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC";
const bintools: BinTools = BinTools.getInstance()
const cHexAddress2: string = "0xecC3B2968B277b837a81A7181e0b94EB1Ca54EdE";
const antAssetID: string = "F4MyJcUvq3Rxbqgd4Zs8sUpvwLHApyrp4yxJXe2bAV86Vvp38";
const avaxAssetID: string = Defaults.network['12345'].X.avaxAssetID;
const txID: string = "QVb7DtKjcwVYLFWHgnGSdzQtQSc29KeRBYFNCBnbFu6dFqX7z";
const blockchainID: string = Defaults.network['12345'].C.blockchainID;
const sourcechainID: string = Defaults.network['12345'].X.blockchainID;
let evmOutputs: EVMOutput[];
let importedIns: TransferableInput[];
const fee: BN = Defaults.network['12345'].C.txFee;

beforeEach((): void => {
  evmOutputs = [];
  importedIns = [];
});

describe('EVM Transactions', () => {
  describe('ImportTx', () => {
    test("Multiple AVAX EVMOutput fail", (): void => {
      // Creating 2 outputs with the same address and AVAX assetID is invalid
      let evmOutput: EVMOutput = new EVMOutput(cHexAddress1, ONEAVAX, avaxAssetID);
      evmOutputs.push(evmOutput);
      evmOutput = new EVMOutput(cHexAddress1, ONEAVAX, avaxAssetID);
      evmOutputs.push(evmOutput);

      expect((): void => {
        new ImportTx(networkID, bintools.cb58Decode(blockchainID), bintools.cb58Decode(sourcechainID), [], evmOutputs);
      }).toThrow("Error - ImportTx: duplicate (address, assetId) pair found in outputs: (0x8db97c7cece249c2b98bdc0226cc4c2a57bf52fc, 2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe)");
    });

    test("Multiple AVAX EVMOutput success", (): void => {
      // Creating 2 outputs with different addresses valid
      const outputidx: Buffer = Buffer.from("");
      const input: SECPTransferInput = new SECPTransferInput(ONEAVAX);
      const xferin: TransferableInput = new TransferableInput(bintools.cb58Decode(txID), outputidx, bintools.cb58Decode(avaxAssetID), input);
      importedIns.push(xferin);

      let evmOutput: EVMOutput = new EVMOutput(cHexAddress1, ONEAVAX.div(new BN(3)), avaxAssetID);
      evmOutputs.push(evmOutput);
      evmOutput = new EVMOutput(cHexAddress2, ONEAVAX.div(new BN(3)), avaxAssetID);
      evmOutputs.push(evmOutput);

      const importTx: ImportTx = new ImportTx(networkID, bintools.cb58Decode(blockchainID), bintools.cb58Decode(sourcechainID), importedIns, evmOutputs);
      expect(importTx).toBeInstanceOf(ImportTx);
    });

    test("Multiple ANT EVMOutput fail", (): void => {
      // Creating 2 outputs with the same address and ANT assetID is invalid
      let evmOutput: EVMOutput = new EVMOutput(cHexAddress1, ONEAVAX, antAssetID);
      evmOutputs.push(evmOutput);
      evmOutput = new EVMOutput(cHexAddress1, ONEAVAX, antAssetID);
      evmOutputs.push(evmOutput);
      expect((): void => {
        new ImportTx(networkID, bintools.cb58Decode(blockchainID), bintools.cb58Decode(sourcechainID), [], evmOutputs);
      }).toThrow("Error - ImportTx: duplicate (address, assetId) pair found in outputs: (0x8db97c7cece249c2b98bdc0226cc4c2a57bf52fc, F4MyJcUvq3Rxbqgd4Zs8sUpvwLHApyrp4yxJXe2bAV86Vvp38)");
    });

    test("Multiple ANT EVMOutput success", (): void => {
      const outputidx: Buffer = Buffer.from("");
      const input: SECPTransferInput = new SECPTransferInput(fee);
      const xferin: TransferableInput = new TransferableInput(bintools.cb58Decode(txID), outputidx, bintools.cb58Decode(avaxAssetID), input);
      importedIns.push(xferin);

      let evmOutput: EVMOutput = new EVMOutput(cHexAddress1, ONEAVAX, antAssetID);
      evmOutputs.push(evmOutput);
      evmOutput = new EVMOutput(cHexAddress2, ONEAVAX, antAssetID);
      evmOutputs.push(evmOutput);

      const importTx: ImportTx = new ImportTx(networkID, bintools.cb58Decode(blockchainID), bintools.cb58Decode(sourcechainID), importedIns, evmOutputs);
      expect(importTx).toBeInstanceOf(ImportTx);
    });

    test("Single ANT EVMOutput fail", (): void => {
      // If the output is a non-avax assetID then don't subtract a fee
      const evmOutput: EVMOutput = new EVMOutput(cHexAddress1, ONEAVAX, antAssetID);
      evmOutputs.push(evmOutput);
      expect((): void => {
        new ImportTx(networkID, bintools.cb58Decode(blockchainID), bintools.cb58Decode(sourcechainID), [], evmOutputs);
      }).toThrow("Error - 1000000 AVAX required for fee and only 0 AVAX provided");
    });

    test("Single ANT EVMOutput success", (): void => {
      const outputidx: Buffer = Buffer.from("");
      const input: SECPTransferInput = new SECPTransferInput(fee);
      const xferin: TransferableInput = new TransferableInput(bintools.cb58Decode(txID), outputidx, bintools.cb58Decode(avaxAssetID), input);
      importedIns.push(xferin);

      const evmOutput: EVMOutput = new EVMOutput(cHexAddress1, ONEAVAX, antAssetID);
      evmOutputs.push(evmOutput);
      const importTx: ImportTx = new ImportTx(networkID, bintools.cb58Decode(blockchainID), bintools.cb58Decode(sourcechainID), importedIns, evmOutputs);
      expect(importTx).toBeInstanceOf(ImportTx);
    });

    test("Single AVAX EVMOutput fail", (): void => {
      const outputidx: Buffer = Buffer.from("");
      const input: SECPTransferInput = new SECPTransferInput(new BN(507));
      const xferin: TransferableInput = new TransferableInput(bintools.cb58Decode(txID), outputidx, bintools.cb58Decode(avaxAssetID), input);
      importedIns.push(xferin);

      const evmOutput: EVMOutput = new EVMOutput(cHexAddress1, new BN(0), avaxAssetID);
      evmOutputs.push(evmOutput);
      expect((): void => {
        new ImportTx(networkID, bintools.cb58Decode(blockchainID), bintools.cb58Decode(sourcechainID), importedIns, evmOutputs);
      }).toThrow("Error - 1000000 AVAX required for fee and only 507 AVAX provided");
    });

    test("Single AVAX EVMOutput success", (): void => {
      const outputidx: Buffer = Buffer.from("");
      const input: SECPTransferInput = new SECPTransferInput(ONEAVAX);
      const xferin: TransferableInput = new TransferableInput(bintools.cb58Decode(txID), outputidx, bintools.cb58Decode(avaxAssetID), input);
      importedIns.push(xferin);

      const evmOutput: EVMOutput = new EVMOutput(cHexAddress1, ONEAVAX.sub(MILLIAVAX), avaxAssetID);
      evmOutputs.push(evmOutput);
      const importTx: ImportTx = new ImportTx(networkID, bintools.cb58Decode(blockchainID), bintools.cb58Decode(sourcechainID), importedIns, evmOutputs);
      expect(importTx).toBeInstanceOf(ImportTx);
    });
  });
});