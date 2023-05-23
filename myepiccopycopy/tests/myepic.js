const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

const main = async () => {
  console.log("🚀 Starting test...");

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Myepic;
  const baseAccount = anchor.web3.Keypair.generate();

  const tx = await program.rpc.initialize({
    accounts:{
      baseAccount:baseAccount.publicKey,
      user:provider.wallet.publicKey,
      systemProgram:SystemProgram.programId,
    },
    signers:[baseAccount],
  });

  console.log("📝 Your transaction signature", tx);

  let account=await program.account.baseAccount.fetch(baseAccount.publicKey);

  console.log('👀 GIF Count',account.totalGifs.toString())
  await program.rpc.addGif("https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDk1Yjk2ZGJjMTZjMmI3MGMxYWIzYTYyYmYyMjk5NTFmODAxNzI5NiZjdD1n/fnW9Ej1b8b0tAOdYm5/giphy.gif://giphy.com/gifs/wdr-sven-hierundheute-svenkroll-fnW9Ej1b8b0tAOdYm5",{
    accounts: {
      baseAccount: baseAccount.publicKey,
      user:provider.wallet.publicKey,
    },
  });


   account=await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count',account.totalGifs.toString()); 

  console.log('👀 GIF Count',account.gifList)
};
 

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
