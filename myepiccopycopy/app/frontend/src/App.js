import kp from "./keypair.json";
import React, { useEffect, useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import "./App.css";
import assert from "assert";
import { Buffer } from "buffer";
window.Buffer = Buffer;
function App() {
  const [userPublicKey, setUserPublicKey] = useState();
  const [gifList, setGifList] = useState([]);
  const { SystemProgram, Keypair } = web3;
  const [inputValue, setInputValue] = useState("");
  const [randomKeyPair, setRandomKeyPairAccount] = useState();
  const [keyPairOne, setKeyPairoOne] = useState();
  const [keyPairOneTwo, setKeyPairoOneTwo] = useState();

  // USE EFFECT 
  
  useEffect(() => {
    if (userPublicKey) {
      console.log("2 Phantom Wallet Address ", userPublicKey);
      setGifList(TEST_GIFS);
    }
  }, [userPublicKey]);


  // WALLET CONNECT 
  const connectWallet = async () => {
    if (!window.solana || !window.solana.isPhantom) {
      alert(
        "Please install and enable the Solana browser extension (Phantom) to use this feature."
      );
      return;
    }

    try {
      await window.solana.connect();
      //

      const arr = Object.values(kp._keypair.secretKey);
      const secret = new Uint8Array(arr);
      const keypairAccount = web3.Keypair.fromSecretKey(secret);
    //   const keypairAccount=web3.Keypair.generate();
    //   console.log(keypairAccount)
    // const secretKeyIsComing=keypairAccount.secretKey
      // const keypairAccountOne = web3.Keypair.fromPublicKey(publicKey);


      setKeyPairoOne(keypairAccount);
      console.log(
        "1 baseAccount-Publickey",
        keypairAccount.publicKey.toString()
      );
      let keyPairString = keypairAccount.publicKey.toString();
      setRandomKeyPairAccount(keyPairString);
      const oneTwo = keypairAccount.publicKey;
      setKeyPairoOneTwo(oneTwo);

      //
    } catch (error) {
      console.log(error);

      alert("Could not connect to wallet");
      return;
    }

    const walletAddress = window.solana.publicKey.toString();
    setUserPublicKey(walletAddress);
  };

  // NETWORK & PROGRAM ID
  const network = clusterApiUrl("devnet");
  const programID = new PublicKey(
    "FPggYPgeyCUT6p56CZuQDzioWudhSquogoUe5bAQwVoa"
  );
  const opts = { preflightCommitment: "processed" };

  //PROVIDER
  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    return provider;
  };

  // PROGRAM CREATION
  const getProgram = async () => {
    const idl = await Program.fetchIdl(programID, getProvider());
    return new Program(idl, programID, getProvider());
  };

 
  // GIF DEMO
  const TEST_GIFS = [
    // "https://giphy.com/gifs/download-IRFQYGCokErS0",
    // "https://giphy.com/gifs/loop-seamless-3o7WTAkv7Ze17SWMOQ",
  ];

  // GIF LIST
  const list = async () => {
    try {
      const program = await getProgram();
      console.log(program);
      const account = await program.account.baseAccount.fetch(
        randomKeyPair,
        "confirmed"
      );

      console.log("Got the account", account);
      
      setGifList(account.gifList);
      console.log("first");
    } catch (error) {
      console.log("Error in getGifList: ", error);
      setGifList(null);
    }
  };

  const createGifAccount = async () => {
    try {
      // const provider = getProvider();
      const program = await getProgram();

      console.log(" 3 keypair public key", randomKeyPair);
      await program.rpc.initialize({
        accounts: {
          baseAccount: keyPairOneTwo,
          user: getProvider().wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [keyPairOne],
      });
      console.log("Created a new BaseAccount w/ address:", randomKeyPair);
      await list();
    } catch (error) {
      console.log("5 Error creating BaseAccount account:", error);
    }
  };
  console.log(gifList);

  const sendGif = async () => {
    if (inputValue.length === 0) {
      console.log("No gif link given!");
      return;
    }
    // setInputValue('');
    console.log("Gif link:", inputValue);
    try {
      const provider = getProvider();
      const program = await getProgram();
      console.log("working till here in send_gif");
      await program.rpc.addGif(inputValue, {
        accounts: {
          baseAccount: keyPairOneTwo,
          user: provider.wallet.publicKey,
        },
      });
      console.log("GIF successfully sent to program", inputValue);

      await list();
    } catch (error) {
      console.log("Error sending GIF:", error);
    }
  };
  // const renderConnectedContainer=()=>{
  //   setClicked(true)
  // }
  const onInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <>
      <div className="App">
        <button onClick={connectWallet}>Connect Wallet</button>
        <button onClick={createGifAccount}>Create Now</button>
        {/* <button onClick={renderConnectedContainer}>Render Connected Container</button> */}
      </div>
      <div>
        {gifList ? (
          <div className="connected-container">
            TRUE IS RUNNING
            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendGif();
              }}
            >
              <input
                type="text"
                placeholder="Enter gif link!"
                value={inputValue}
                onChange={onInputChange}
                // onChange={inputValue}
              />
              <button type="submit" className="cta-button submit-gif-button">
                Submit
              </button>
            </form>
            <div className="gif-grid">
              {/* We use index as the key instead, also, the src is now item.gifLink */}
              {gifList.map((item, index) => (
                <div className="gif-item" key={index}>
                  <img src={item.gifLink} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="connected-container">
            <button
              className="cta-button submit-gif-button"
              onClick={createGifAccount}
            >
              Do One-Time Initialization For GIF Program Account
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;

// import React, { useEffect, useState } from "react";
// import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
// import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
// import "./App.css";
// import assert from "assert";

// function App() {
//   //CONST DECLARED
//   const [userPublicKey, setUserPublicKey] = useState();
//   const [gifList, setGifList] = useState([]);
//   const { SystemProgram, Keypair } = web3;

//   const [randomKeyPair,setRandomKeyPairAccount]=useState()
//   const[keyPairOne,setKeyPairoOne]=useState()
//   const[keyPairOneTwo,setKeyPairoOneTwo]=useState()

//   useEffect(() => {
//     if (userPublicKey) {
//       console.log("2 Phantom Wallet Address ",userPublicKey);
//       // createGifAccount();
//       setGifList(TEST_GIFS);
//        createGifAccount()
//       list()
//     }
//   }, [userPublicKey]);

//   const connectWallet = async () => {
//     if (!window.solana || !window.solana.isPhantom) {
//       alert(
//         "Please install and enable the Solana browser extension (Phantom) to use this feature."
//         );
//         return;
//       }

//       try {
//         await window.solana.connect();
// //
//         let keypairAccount = Keypair.generate();
//         setKeyPairoOne(keypairAccount)
//         console.log("1 baseAccount-Publickey", keypairAccount.publicKey.toString())
//         let keyPairString=keypairAccount.publicKey.toString()
//         setRandomKeyPairAccount(keyPairString)
//         const oneTwo=keypairAccount.publicKey
//         setKeyPairoOneTwo(oneTwo)
//       //
//       } catch (error) {
//         console.log(error);

//         alert("Could not connect to wallet");
//         return;
//       }

//     const walletAddress = window.solana.publicKey.toString();
//     setUserPublicKey(walletAddress);
//   };
//   console.log(gifList)

//   const network = clusterApiUrl("devnet");
//   const programID = new PublicKey( "FPggYPgeyCUT6p56CZuQDzioWudhSquogoUe5bAQwVoa");
//   const opts = { preflightCommitment: "processed",};

//   //PROVIDER
//   const getProvider = () => {
//     const connection = new Connection(network, opts.preflightCommitment);
//     const provider = new AnchorProvider(
//       connection,
//       window.solana,
//       opts.preflightCommitment
//     );
//     return provider;
//   };

//   // PROGRAM CREATION
//   const getProgram = async () => {
//     const idl = await Program.fetchIdl(programID, getProvider());
//     return new Program(idl, programID, getProvider());
//   };

// // -------------------------------------------
//   // GIF DEMO
//   const TEST_GIFS = [
//     "https://giphy.com/gifs/download-IRFQYGCokErS0",
//     "https://giphy.com/gifs/loop-seamless-3o7WTAkv7Ze17SWMOQ",
//   ];

//   // GIF LIST
//   const list = async() => {
//     try {

//       const program = await getProgram();
//       console.log(program)
//       const account = await program.account.baseAccount.fetch(randomKeyPair,"confirmed");

//       console.log("Got the account", account)
//       setGifList(account.gifList)

//     } catch (error) {
//       console.log("Error in getGifList: ", error)
//       setGifList(null);
//     }
//   }

//   // console.log(gifList)

//   // CONNECT WALLET

//   const createGifAccount = async () => {
//     try {
//       const provider = getProvider();
//       const program = await getProgram();

//       console.log(" 3 keypair public key",randomKeyPair);
//       await program.rpc.initialize({
//         accounts: {
//           baseAccount: keyPairOneTwo,
//           user: provider.wallet.publicKey,
//           systemProgram: SystemProgram.programId,
//         },
//         signers: [keyPairOne],
//       });
//       // console.log(
//       //   " 4  Created a new BaseAccount w/ address:",
//       //   baseAccount.publicKey.toString()
//       // );
//     } catch (error) {
//       console.log("5 Error creating BaseAccount account:", error);
//     }
//   };

//   return (
//     <div className="App">
//       <button onClick={connectWallet}>Connect Wallet</button>
//     </div>
//   );
// }

// export default App;
