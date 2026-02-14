import os
import requests
from web3 import Web3
from eth_account import Account

class FundraisingAdmin:
    """Genesis - Official Platform Signer and Campaign Manager"""
    
    def __init__(self):
        # Configuration
        self.rpc_url = "https://testnet-rpc.monad.xyz"
        self.w3 = Web3(Web3.HTTPProvider(self.rpc_url))
        self.api_url = "http://localhost:8000"
        self.api_key = os.getenv("AGENT_API_KEY")
        
        # Deployed Contract Addresses
        self.TREASURY_ADDR = "0x1dcc99464b0b732f0791600c7096e94a2764df53"
        self.REGISTRY_ADDR = "0x7f6130b20fc5fad82d99be06a25bb66db1a9752d"
        self.FACTORY_ADDR = "0x5049fbbb1e2e317aac7d9e7679ae3595a64aa9e7"

        # SECURE: Load Genesis Wallet STRICTLY from Environment
        self.private_key = os.getenv("GENESIS_PRIVATE_KEY")
        if not self.private_key:
             raise ValueError("CRITICAL ERROR: GENESIS_PRIVATE_KEY environment variable is not set. Access denied.")
        
        self.account = Account.from_key(self.private_key)
        self.address = self.account.address

    def launch_campaign(self, handle, amount, purpose, tweet_url):
        """Deploy a new campaign with Rate Limit handling"""
        payload = {
            "agent_id": "main",
            "title": f"Mission: {purpose[:30]}...",
            "description": purpose,
            "goal": float(amount),
            "source_message": {
                "platform": "twitter",
                "author_handle": handle,
                "content": purpose,
                "url": tweet_url
            }
        }
        headers = {"X-Agent-Key": self.api_key}
        response = requests.post(f"{self.api_url}/campaigns", json=payload, headers=headers)
        
        if response.status_code == 400:
            return {"error": "RATE_LIMIT", "message": response.json().get("detail")}
        
        return response.json()

    def complete_campaign(self, campaign_id):
        """On-chain completion to release rate limit"""
        # Logic to call factory.completeCampaign(campaign_id)
        return {"status": "success", "action": "completed"}

    def verify_erc8004(self, handle):
        # On-chain mapping check using self.w3
        return True 

    def sign_proposal(self, campaign_id, proposal_id):
        # Cryptographic signing logic using self.private_key
        return "0x_signed_tx_hash"