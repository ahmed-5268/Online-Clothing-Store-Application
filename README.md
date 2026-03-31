# Online-Clothing-Store-Application
Most developers can build a "Happy Path" shopping cart. But what happens when multiple users try to buy the last few items in stock at the exact same millisecond?

In my latest project—a Full-Stack E-Commerce platform built with ReactJS and Node.js/Express—I decided to move beyond basic CRUD operations to focus on Distributed Systems challenges: Concurrency Control and Data Integrity.

🛠 The Engineering Challenge
The goal was to prevent Race Conditions and Deadlocks during the high-pressure checkout phase. Without proper handling, simultaneous requests can lead to "overselling" or database corruption.

💡 Technical Deep-Dive:
*Race Condition Mitigation: I leveraged MySQL Database-level Transactions to ensure ACID compliance. By implementing row-level locking, I ensured that inventory updates are Atomic. If the stock isn't available, the transaction fails gracefully rather than corrupting the system state.

*Deadlock Avoidance: I optimized transaction lifecycles and resource ordering to ensure the backend remains non-blocking. This prevents circular wait conditions, keeping the server responsive even under heavy concurrent load.

*Source of Truth: As seen in my terminal logs, the system maintains strict integrity—sequentially processing orders and accurately decrementing stock (e.g., from 14 down to 13) without any data leakage between parallel requests.
📈 Why This Matters:
In production, even a 0.1% error in concurrency can lead to significant revenue loss and poor user experience. This project allowed me to master thread-safe logic and robust backend architecture designed to scale.



