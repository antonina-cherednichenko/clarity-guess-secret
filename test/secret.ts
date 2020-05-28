import { Client, Provider, ProviderRegistry, Result } from "@blockstack/clarity";
import { assert } from "chai";
describe("secret contract test suite", () => {
  let secretClient: Client;
  let provider: Provider;
  before(async () => {
    provider = await ProviderRegistry.createProvider();
    secretClient = new Client("SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB.secret", "secret", provider);
  });
  it("should have a valid syntax", async () => {
    await secretClient.checkContract();
  });
  describe("deploying an instance of the contract", () => {
    const execMethod = async (method: string, _args) => {
      const tx = secretClient.createTransaction({
        method: {
          name: method,
          args: _args,
        },
      });
      await tx.sign("SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7");
      const receipt = await secretClient.submitTransaction(tx);
      return receipt;
    }
    before(async () => {
      await secretClient.deployContract();
    });
    
    it("should return true when matches keccak256 secret", async () => {
      const receipt = await execMethod("guess-secret-keccak256", [0]);
      assert.equal(receipt.success, true)
    })

    it("should return false when does not match keccak256 secret", async () => {
      const receipt1 = await execMethod("guess-secret-keccak256", [1]);
      assert.equal(receipt1.success, false)

      const receipt2 = await execMethod("guess-secret-keccak256", [15]);
      assert.equal(receipt2.success, false)
    })

    it("should return true when matches hash160 secret", async () => {
      const receipt = await execMethod("guess-secret-hash160", [0]);
      assert.equal(receipt.success, true)
    })

    it("should return false when does not match hash160 secret", async () => {
      const receipt1 = await execMethod("guess-secret-hash160", [3]);
      assert.equal(receipt1.success, false)

      const receipt2 = await execMethod("guess-secret-hash160", [18]);
      assert.equal(receipt2.success, false)
    })
  });
  after(async () => {
    await provider.close();
  });
});
