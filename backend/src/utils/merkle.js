import { MerkleTree } from 'merkletreejs';
import SHA256 from 'crypto-js/sha256.js';

/**
 * Hotspot kanıtlarından Merkle Tree oluşturur
 * @param {string[]} dataHashes - Veri hash'leri
 * @returns {object} { root, tree, leaves }
 */
export function createMerkleTree(dataHashes) {
  const leaves = dataHashes.map(x => SHA256(x));
  const tree = new MerkleTree(leaves, SHA256);
  const root = tree.getRoot().toString('hex');

  return { root, tree, leaves };
}

/**
 * Belirli bir veri için Merkle Proof oluşturur
 * @param {MerkleTree} tree - Merkle Tree instance
 * @param {string} dataHash - Veri hash'i
 * @returns {string[]} Proof array
 */
export function generateProof(tree, dataHash) {
  const leaf = SHA256(dataHash);
  const proof = tree.getProof(leaf);
  return proof.map(x => x.data.toString('hex'));
}

/**
 * Merkle Proof'u doğrular
 * @param {string[]} proof - Proof array
 * @param {string} leaf - Leaf hash
 * @param {string} root - Root hash
 * @returns {boolean} Doğrulama sonucu
 */
export function verifyProof(proof, leaf, root) {
  const tree = new MerkleTree([], SHA256);
  return tree.verify(proof, SHA256(leaf), root);
}

