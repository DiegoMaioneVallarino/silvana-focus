
import { useState } from "react";
import type { FormEvent } from "react";

import type {
  TransactionType,
  TransactionCategory,
} from "../finances.types";

import { useFinancesStore } from "../finances.store";

import {
  incomeCategories,
  expenseCategories,
  financeCategories,
} from "../finances.utils";

import { toLocalDateKey } from "../../streaks/streaks.utils";

export function TransactionForm() {
  const addTransaction = useFinancesStore(
    (state) => state.addTransaction
  );

  const [type, setType] =
    useState<TransactionType>("expense");

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] =
    useState<TransactionCategory>("food");

  const [date, setDate] = useState(
    toLocalDateKey(new Date())
  );

  const [notes, setNotes] = useState("");

  const categories =
    type === "income"
      ? incomeCategories
      : expenseCategories;

  function handleTypeChange(
    nextType: TransactionType
  ) {
    setType(nextType);
    setCategory(
      nextType === "income"
        ? "salary"
        : "food"
    );
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const value = Number(amount);

    if (
      !title.trim() ||
      !Number.isFinite(value) ||
      value <= 0
    ) {
      return;
    }

    const id = addTransaction({
      title: title.trim(),
      amount: value,
      type,
      category,
      date,
      notes: notes.trim(),
    });

    if (!id) return;

    setTitle("");
    setAmount("");
    setNotes("");
  }

  return (
    <form
      className="sf-finance-form sf-card"
      onSubmit={handleSubmit}
    >
      <h3>Nueva transacción</h3>

      <div className="sf-finance-type-switch">
        <button
          type="button"
          className={
            type === "expense"
              ? "active expense"
              : ""
          }
          onClick={() =>
            handleTypeChange("expense")
          }
        >
          Gasto
        </button>

        <button
          type="button"
          className={
            type === "income"
              ? "active income"
              : ""
          }
          onClick={() =>
            handleTypeChange("income")
          }
        >
          Ingreso
        </button>
      </div>

      <label>
        Concepto
        <input
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          placeholder="Ej. Compra de supermercado"
          required
        />
      </label>

      <label>
        Cantidad (MXN)
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) =>
            setAmount(event.target.value)
          }
          required
        />
      </label>

      <label>
        Categoría
        <select
          value={category}
          onChange={(event) =>
            setCategory(
              event.target.value as TransactionCategory
            )
          }
        >
          {categories.map((item) => (
            <option
              key={item}
              value={item}
            >
              {financeCategories[item].emoji}{" "}
              {financeCategories[item].label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Fecha
        <input
          type="date"
          value={date}
          onChange={(event) =>
            setDate(event.target.value)
          }
          required
        />
      </label>

      <label>
        Notas
        <textarea
          rows={2}
          value={notes}
          onChange={(event) =>
            setNotes(event.target.value)
          }
          placeholder="Opcional"
        />
      </label>

      <button
        className="sf-finance-primary"
        type="submit"
      >
        Guardar transacción
      </button>
    </form>
  );
}
