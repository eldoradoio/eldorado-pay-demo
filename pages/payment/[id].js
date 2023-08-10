import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Home.module.css";

export default function Payment() {
    const router = useRouter()
    const [payment, setPayment] = useState()
    const [error, setError] = useState()
    const status = payment?.status

    async function loadData(id) {
        setPayment(await axios.get(`/api/get-payment?id=${id}`).then(x => x.data))
    }

    useEffect(() => {
        if (router.query.id)
            loadData(router.query.id)
    }, [router.query.id])

    function createCheckOut() {
        window.open(payment.href, '_blank')
    }

    if(!payment){
        return <div className={styles.container}>
            Loading payment...
        </div>
    }


    return <div className={styles.container}>
        <Head>
            <title>El Dorado Pay - Demo</title>
            <meta
                name="description"
                content="El Dorado Pay Demo"
            />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
            {status && status === "ACCPETED" && (
                <div className="bg-green-100 text-green-700 p-2 rounded border mb-2 border-green-700">
                    Payment Successful
                </div>
            )}
            {status && status === "REQUESTED" && (
                <div className="bg-yellow-100 text-yellow-700 p-2 rounded border mb-2 border-yellow-700">
                    Please pay
                </div>
            )}
            {status && status === "CANCELLED" && (
                <div className="bg-red-100 text-red-700 p-2 rounded border mb-2 border-red-700">
                    Payment Unsuccessful
                </div>
            )}

            <div className="shadow-lg border rounded p-2 ">
                <h3 className="text-xl">Payment ID: {payment?.id}</h3>
                <p className="text-gray-500">Status: {payment?.status}</p>
                <p className="text-sm text-gray-600 mt-1">{payment?.description}</p>

                {status === "REQUESTED" &&
                    <button
                        disabled={!payment}
                        onClick={createCheckOut}
                        className="bg-eldo-500 hover:bg-eldo-600 text-white flex justify-center w-full py-2 rounded mt-2 disabled:cursor-not-allowed disabled:bg-eldo-100"
                    >
                        <Image src={'/eldo-bw.png'} width={20} height={20} alt={"ELDO"} className="mr-2" />
                        {"Pay with El Dorado"}
                    </button>
                }
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
}