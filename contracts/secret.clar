
;; A simple smart contract for guessing secret value hashed by keccak256 and hash160
;; Secret value is 0
(define-constant secret-keccak256 0xf490de2920c8a35fabeb13208852aa28c76f9be9b03a4dd2b3c075f7a26923b4)
(define-constant secret-hash160 0xe4352f72356db555721651aa612e00379167b30f)

(define-public (guess-secret-keccak256 (guess int))
  (if (is-eq (keccak256 guess) secret-keccak256)
    (ok true)
    (err false)))

(define-public (guess-secret-hash160 (guess int))
  (if (is-eq (hash160 guess) secret-hash160)
    (ok true)
    (err false)))
