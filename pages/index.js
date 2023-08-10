import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { status } = router.query;

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [redirecting, setRedirecting] = useState(false)

  const [item, setItem] = useState({
    name: "Tasty bag",
    description: "Box with assorted groceries",
    image:
      "https://images.unsplash.com/photo-1543168256-418811576931?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    quantity: 0,
    price: 0.9,
  });

  const changeQuantity = (value) => {
    // Don't allow the quantity less than 0, if the quantity is greater than value entered by user then the user entered quantity is used, else 0
    setItem({ ...item, quantity: Math.max(0, value) });
  };

  const onInputChange = (e) => {
    changeQuantity(parseInt(e.target.value));
  };

  const onQuantityPlus = () => {
    changeQuantity(item.quantity + 1);
  };

  const onQuantityMinus = () => {
    changeQuantity(item.quantity - 1);
  };

  const createCheckOut = async () => {
    setLoading(true);
    let checkoutResult;
    try {
      checkoutResult = await axios.post("/api/create-payment-request", {
        item: item,
      }).then(x => x.data)


    } catch (e) {
      setError(e.message ?? JSON.stringify(e))
    }
    setLoading(false);
    if (checkoutResult) {
      setRedirecting(true)
      router.push(`/payment/${checkoutResult.id}`)
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>El Dorado Pay - Demo</title>
        <meta
          name="description"
          content="El Dorado Pay Demo"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {status && status === "success" && (
          <div className="bg-green-100 text-green-700 p-2 rounded border mb-2 border-green-700">
            Payment Successful
          </div>
        )}
        {status && status === "cancel" && (
          <div className="bg-red-100 text-red-700 p-2 rounded border mb-2 border-red-700">
            Payment Unsuccessful
          </div>
        )}
        <div className="shadow-lg border rounded p-2 ">
          <Image src={item.image} width={300} height={150} alt={item.name} />
          <h2 className="text-2xl">$ {item.price}</h2>
          <h3 className="text-xl">{item.name}</h3>
          <p className="text-gray-500">{item.description}</p>
          <p className="text-sm text-gray-600 mt-1">Quantity:</p>
          <div className="border rounded p-2 flex h-16">
            <button
              onClick={onQuantityMinus}
              className="bg-blue-500 py-2 w-10 text-white rounded hover:bg-blue-600"
            >
              -
            </button>
            <input
              type="number"
              className="py-4 mx-2"
              onChange={onInputChange}
              value={item.quantity}
            />
            <button
              onClick={onQuantityPlus}
              className="bg-blue-500 py-2 w-10 text-white rounded hover:bg-blue-600"
            >
              +
            </button>
          </div>
          <p>Total: ${item.quantity * item.price}</p>
          <button
            disabled={item.quantity === 0 || loading || redirecting}
            onClick={createCheckOut}
            className="bg-eldo-500 hover:bg-eldo-600 text-white flex justify-center w-full py-2 rounded mt-2 disabled:cursor-not-allowed disabled:bg-eldo-100"
          >
            <Image src={'/eldo-bw.png'} width={20} height={20} alt={item.name} className="mr-2" />
            {loading ? "Processing..." : redirecting ? "Redirecting..." : "Pay with El Dorado"}
          </button>
        </div>
        <a
          className="block text-blue-500 mt-4"
          href="https://api-testnet.eldorado.io"
        >
          Integrate it now!
        </a>
        {error &&
          <div className="bg-yellow-100 text-yellow-700 p-2 mt-2 rounded border mb-2 border-yellow-700">
            Could not process payment
            <p>{error}</p>
          </div>
        }
      </main>
    </div>
  );
}
