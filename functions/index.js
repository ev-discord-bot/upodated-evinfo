const fetchUserButton = document.getElementById('fetchUserButton');
const usernameInput = document.getElementById('usernameInput');
const loadingMessage = document.getElementById('loadingMessage');
const userInfoDiv = document.getElementById('userInfo');

const fetchUserInfo = () => {
   const username = usernameInput.value.trim();

   if (username === '') {
      showToast('Please enter a username.', 'danger');
      return;
   }

   loadingMessage.style.display = 'block';
   userInfoDiv.style.display = 'none';

   fetch(`https://ev.io/stats-by-un/${encodeURIComponent(username)}`)
      .then(response => {
         if (!response.ok) {
            throw new Error(`Failed to fetch user information. Status: ${response.status}`);
         }
         return response.json();
      })
      .then(data => {
         loadingMessage.style.display = 'none';

         if (data.length === 0) {
            showToast('User not found.', 'danger');
         } else {
            const user = data[0];
            const uidUrl = `https://ev.io/user/${user.uid[0].value}`;
            const eCoinBalance = user.field_ev_coins[0].value;
            const usdValue = eCoinBalance / 2000;
            const usdValueFormatted = usdValue.toLocaleString("en-US", {
               style: "currency",
               currency: "USD"
            });

            const skinID = user.field_eq_skin[0]?.target_id;
            if (skinID) {
               fetch(`https://ev.io/node/${skinID}?_format=json`)
                  .then(response => {
                     if (!response.ok) {
                        throw new Error(`Failed to fetch skin information. Status: ${response.status}`);
                     }
                     return response.json();
                  })
                  .then(skinData => {
                     const skinimg = skinData.field_wallet_image[0]?.url;
                     renderUserInfo(user, uidUrl, usdValueFormatted, skinimg);
                  })
                  .catch(error => {
                     console.error('Error fetching skin info:', error);
                     renderUserInfo(user, uidUrl, usdValueFormatted);
                  });
            } else {
               renderUserInfo(user, uidUrl, usdValueFormatted);
            }
         }
      })
      .catch(error => {
         loadingMessage.style.display = 'none';
         userInfoDiv.innerHTML = `<p>Error fetching user information. ${error.message}</p>`;
         console.error('Error:', error);
      });
};

const renderUserInfo = (user, uidUrl, usdValueFormatted, skinimg = '') => {
   userInfoDiv.innerHTML = `
   <div class="items-center justify-center">
        <div class="text-3xl font-bold p-1 items-center justify-center" style="padding: 0; display: flex; align-items: center;">
           User Info for ${user.name[0].value} <img src="${skinimg}" height="auto" width="35px" class="rounded-3xl" style="margin-left: 10px;">
        </div>
        <div class="grid grid-rows-1 grid-flow-col gap-4 items-center justify-center p-4">
           <div class="backdrop-sepia-0 shadow-lg shadow-[#7289da] rounded-lg p-2 items-center justify-center select-all">
              <strong>User URL:</strong> 
              <a style="text-decoration: none;" href="${uidUrl}" target="_blank">https://ev.io/user/${user.uid[0].value}</a>
           </div>
           <div class="backdrop-sepia-0 shadow-lg shadow-[#7289da] rounded-lg p-2 items-center justify-center select-all">
              <strong>Bio:</strong> 
              ${user.field_social_bio[0]?.value || 'No Bio Set'} ${user.field_social_bio[0]?.value.toLowerCase().includes('the lag tho') || user.field_social_bio[0]?.value.toLowerCase().includes('lag') ? '(fr tho)' : ''}
           </div>
        </div>
        <div class="grid grid-rows-2 grid-flow-col gap-4 items-center justify-center">
           <div class="backdrop-sepia-0 shadow-md shadow-[#7289da] rounded-lg p-2 items-center justify-center select-all">
              <strong>Kills:</strong><br>
              ${user.field_kills[0].value.toLocaleString()}
           </div>
           <div class="backdrop-sepia-0 shadow-md shadow-[#7289da] rounded-lg p-2 items-center justify-center select-all">
              <strong>Deaths:</strong><br>
              ${user.field_deaths[0].value.toLocaleString()}
           </div>
           <div class="backdrop-sepia-0 shadow-md shadow-[#7289da] rounded-lg p-2 items-center justify-center select-all">
              <strong>KD:</strong><br>
              ${user.field_k_d[0].value}
           </div>
           <div class="backdrop-sepia-0 shadow-md shadow-[#7289da] rounded-lg p-2 items-center justify-center select-all">
              <strong>Ranking:</strong><br>
              ${user.field_rank[0].value}
           </div>
           <div class="backdrop-sepia-0 shadow-md shadow-[#7289da] rounded-lg p-2 items-center justify-center select-all">
              <strong>Score:</strong><br>
              ${user.field_score[0].value.toLocaleString()}
           </div>
           <div class="backdrop-sepia-0 shadow-md shadow-[#7289da] rounded-lg p-2 items-center justify-center select-all">
              <strong>Coins:</strong><br>
              ${user.field_ev_coins[0].value.toLocaleString()}
           </div>
        </div>
        <div class="grid grid-rows-1 grid-flow-col gap-4 items-center justify-center p-4">
           <div class="backdrop-sepia-0 shadow-md shadow-[#7289da] rounded-lg p-2 items-center justify-center select-all">
              <strong>Coins Value:</strong><br>
              ${usdValueFormatted} (USD)
           </div>
        </div>
    </div>     
            `;

   userInfoDiv.style.display = 'block';
};

fetchUserButton.addEventListener('click', fetchUserInfo);

usernameInput.addEventListener('keyup', event => {
   if (event.key === 'Enter') {
      fetchUserInfo();
   }
});

const EarnRateContainer = document.getElementById('Earn-Rate');

window.addEventListener('load', async () => {
   EarnRateContainer.innerHTML = 'Fetching Earn Rate...';

   try {
      const response = await fetch('https://ev.io/vars');
      const EarnRatepData = await response.json();
      const field_e_earn_rate_per_100_score = EarnRatepData[0]['field_e_earn_rate_per_100_score'];
      const field_earnings_cap = EarnRatepData[0]['field_earnings_cap'];
      const earnRateDataHtml = `
    <div class="flex flex-col items-center justify-center place-content-center">
       <h2 class="text-2xl font-bold flex items-center">
          <img src="src/e_coin.png" alt="Sol Logo" class="w-7 h-auto mr-2">
          Current Earn Rate
       </h2>
       <p class="text-center">E Earn Rate Per 100 Score: <strong>${field_e_earn_rate_per_100_score}</strong></p>
       <p class="text-center">Earnings Cap: <strong>${field_earnings_cap}</strong></p>
    </div>
`;
      EarnRateContainer.innerHTML = earnRateDataHtml;
   } catch (error) {
      console.error('Error:', error);
      EarnRateContainer.innerHTML = 'An error occurred while fetching Earn Rate.';
   }
});

const nftDropsContainer = document.getElementById('nft-drops');

window.addEventListener('load', async () => {
   nftDropsContainer.innerHTML = 'Fetching NFT Drops...';

   try {
      const response = await fetch('https://ev.io/nft-drops');
      const nftDropData = await response.json();

      const nftDropsGrid = document.createElement('div');

      for (const nftDrop of nftDropData) {
         const nftDropItem = document.createElement('div');

         const nftDropContent = `
         <div class="grid grid-rows-1 grid-flow-col gap-5 items-center justify-center p-1 flex justify-center items-center">
         <div class="rounded-lg p-3 flex items-center justify-center">
            <div class="flex items-center">
               <img src="src/token_icon.png" alt="Sol Logo" class="w-6 h-auto mr-2">
               <h2 class="text-lg font-bold">${nftDrop.type}</h2>
            </div>
            <div class="nft-drop-info text-sm ml-4">
               <p><strong>Name:</strong> ${nftDrop.title}</p>
               <p><strong>Tier:</strong> ${nftDrop.field_tier}</p>
               <p><strong>Drop Chance:</strong> ${nftDrop.field_drop_chance}</p>
               <p><strong>Quantity Left:</strong> ${nftDrop.field_quantity_left}</p>
            </div>
         </div>
      </div> 
`;

         nftDropItem.innerHTML = nftDropContent;
         nftDropsGrid.appendChild(nftDropItem);
      }

      nftDropsContainer.innerHTML = '';
      nftDropsContainer.appendChild(nftDropsGrid);
   } catch (error) {
      console.error('Error:', error);
      nftDropsContainer.innerHTML = 'An error occurred while fetching NFT drops.';
   }
});

document.addEventListener('DOMContentLoaded', fetchCryptocurrencyInfo);

function fetchCryptocurrencyInfo() {
   fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd%2Cinr%2Cphp")
      .then(response => {
         if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
         }
         return response.json();
      })
      .then(data => {
         const usd = data.solana.usd;
         const inr = data.solana.inr;
         const php = data.solana.php;

         updateCurrencyData('usd', usd);
         updateCurrencyData('inr', inr);
         updateCurrencyData('php', php);
      })
      .catch(error => {
         console.error('Error:', error);
      });
}

function updateCurrencyData(currencyId, value) {
   const loader = document.getElementById(`${currencyId}Loader`);
   const dataElement = document.getElementById(`${currencyId}Data`);

   loader.remove();
   dataElement.textContent = `${value}`;
   dataElement.classList.remove('hidden');
}


document.addEventListener("DOMContentLoaded", () => {
   const fetchUserButton = document.getElementById('fetchUserButtonTabs');
   const usernameInput = document.getElementById('usernameInputTabs');
   const loadingMessage = document.getElementById('loadingMessageTabs');
   const tabButtons = document.querySelectorAll('.custom-tab-button');
   const tabs = document.querySelectorAll('.custom-tab');

   const fetchEquippedSkins = () => {
      const username = usernameInput.value.trim();
      if (username === '') {
         showToast('Please enter an ev.io username.', 'danger');
         return;
      }

      loadingMessage.style.display = 'block';

      tabs.forEach(tab => {
         tab.style.display = 'none';
      });

      fetch(`https://ev.io/stats-by-un/${encodeURIComponent(username)}`)
         .then(response => {
            if (!response.ok) {
               throw new Error('Network response was not ok');
            }
            return response.json();
         })
         .then(data => {
            loadingMessage.style.display = 'none';

            if (data.length === 0) {
               tabs.forEach(tab => {
                  showToast('User not found', 'danger');
               });
            } else {
               const user = data[0];

               const characterSkinId = user.field_eq_skin[0]?.target_id;
               if (characterSkinId) {
                  fetch(`https://ev.io/node/${characterSkinId}?_format=json`)
                     .then(response => response.json())
                     .then(skinData => {
                        const skinName = skinData.title[0].value;
                        const skinIcon = skinData.field_large_thumb[0].url;
                        displaySkin('CharacterTab', skinName, skinIcon);
                     })
                     .catch(error => console.error('Error fetching character skin:', error));
               } else {
                  displayNoSkin('CharacterTab');
               }

               const arSkinId = user.field_auto_rifle_skin[0]?.target_id;
               if (arSkinId) {
                  fetch(`https://ev.io/node/${arSkinId}?_format=json`)
                     .then(response => response.json())
                     .then(skinData => {
                        const skinName = skinData.title[0].value;
                        const skinIcon = skinData.field_weapon_skin_thumb[0].url;
                        displaySkin('AssaultRifleTab', skinName, skinIcon);
                     })
                     .catch(error => console.error('Error fetching AR skin:', error));
               } else {
                  displayNoSkin('AssaultRifleTab');
               }

               const hcSkinId = user.field_hand_cannon_skin[0]?.target_id;
               if (hcSkinId) {
                  fetch(`https://ev.io/node/${hcSkinId}?_format=json`)
                     .then(response => response.json())
                     .then(skinData => {
                        const skinName = skinData.title[0].value;
                        const skinIcon = skinData.field_weapon_skin_thumb[0].url;
                        displaySkin('HandCannonTab', skinName, skinIcon);
                     })
                     .catch(error => console.error('Error fetching HC skin:', error));
               } else {
                  displayNoSkin('HandCannonTab');
               }

               const lrSkinId = user.field_laser_rifle_skin[0]?.target_id;
               if (lrSkinId) {
                  fetch(`https://ev.io/node/${lrSkinId}?_format=json`)
                     .then(response => response.json())
                     .then(skinData => {
                        const skinName = skinData.title[0].value;
                        const skinIcon = skinData.field_weapon_skin_thumb[0].url;
                        displaySkin('LaserRifleTab', skinName, skinIcon);
                     })
                     .catch(error => console.error('Error fetching LR skin:', error));
               } else {
                  displayNoSkin('LaserRifleTab');
               }

               const brSkinId = user.field_burst_rifle_skin[0]?.target_id;
               if (brSkinId) {
                  fetch(`https://ev.io/node/${brSkinId}?_format=json`)
                     .then(response => response.json())
                     .then(skinData => {
                        const skinName = skinData.title[0].value;
                        const skinIcon = skinData.field_weapon_skin_thumb[0].url;
                        displaySkin('BurstRifleTab', skinName, skinIcon);
                     })
                     .catch(error => console.error('Error fetching BR skin:', error));
               } else {
                  displayNoSkin('BurstRifleTab');
               }

               const sweeperSkinId = user.field_sweeper_skin[0]?.target_id;
               if (sweeperSkinId) {
                  fetch(`https://ev.io/node/${sweeperSkinId}?_format=json`)
                     .then(response => response.json())
                     .then(skinData => {
                        const skinName = skinData.title[0].value;
                        const skinIcon = skinData.field_weapon_skin_thumb[0].url;
                        displaySkin('SweeperTab', skinName, skinIcon);
                     })
                     .catch(error => console.error('Error fetching BR skin:', error));
               } else {
                  displayNoSkin('SweeperTab');
               }

               const swordSkinId = user.field_sword_skin[0]?.target_id;
               if (swordSkinId) {
                  fetch(`https://ev.io/node/${swordSkinId}?_format=json`)
                     .then(response => response.json())
                     .then(skinData => {
                        const skinName = skinData.title[0].value;
                        const skinIcon = skinData.field_weapon_skin_thumb[0].url;
                        displaySkin('SwordTab', skinName, skinIcon);
                     })
                     .catch(error => console.error('Error fetching BR skin:', error));
               } else {
                  displayNoSkin('SwordTab');
               }


            }
         })
         .catch(error => {
            loadingMessage.style.display = 'none';
            tabs.forEach(tab => {
               tab.innerHTML = '<p>Error fetching user information.</p>';
            });
            console.error('Error:', error);
         });
   };

   const displaySkin = (tabId, skinName, skinIcon) => {
      const tab = document.getElementById(tabId);
      tab.innerHTML = `
      <div class="justify-center items-center">
    <p class="text-center font-medium ">${skinName}</p>
    <img src="${skinIcon}" alt="${skinName} Skin" class="max-w-[95px] mt-2 p-1 drop-shadow-xl justify-center items-center">
    </div>
    `;


      tab.style.display = 'block';
   };

   const displayNoSkin = (tabId) => {
      const tab = document.getElementById(tabId);
      tab.innerHTML = '<p class="font-medium flex justify-center items-center">No skin equipped</p>';
      tab.style.display = 'block';
   };

   const handleEnterKey = (event) => {
      if (event.key === 'Enter') {
         fetchEquippedSkins();
      }
   };

   fetchUserButton.addEventListener('click', fetchEquippedSkins);
   usernameInput.addEventListener('keydown', handleEnterKey);

   tabButtons.forEach(button => {
      button.addEventListener('click', () => {
         tabs.forEach(tab => {
            tab.style.display = 'none';
         });

         const tabId = button.getAttribute('data-tab');
         const tab = document.getElementById(tabId);
         tab.style.display = 'block';
      });
   });
});

const notificationButton = document.getElementById('notificationButton');
const popup = document.getElementById('popup');
const closeButton = document.getElementById('closeButton');

function showPopup() {
   popup.classList.remove('hidden')
}

function hidePopup() {
   popup.classList.add('hidden');
}

function togglePopup() {
   popup.classList.toggle('hidden');
}
notificationButton.addEventListener('click', togglePopup);
closeButton.addEventListener('click', hidePopup);
document.addEventListener('click', function (event) {
   if (!notificationButton.contains(event.target) && !popup.contains(event.target)) {
      hidePopup();
   }
});


//itesting


const pageSize = 6;

async function fetchUserUid() {
   const username = document.getElementById('usernameInputnft').value.trim();

   if (username === '') {
      showToast('Please enter a username.', 'danger');
      return;
   }

   try {
      document.getElementById('loadingMessage').classList.remove('hidden');
      const response = await fetch(`https://ev.io/stats-by-un/${encodeURIComponent(username)}`);

      if (!response.ok) {
         throw new Error(`Failed to fetch user data. Status: ${response.status}, ${response.statusText}`);
      }
      const data = await response.json();
      document.getElementById('loadingMessage').classList.add('hidden');

      if (data.length === 0) {
         showToast('User not found.', 'danger');
      } else {
         return data[0].uid[0].value;
      }
   } catch (error) {
      console.error('Error fetching user data:', error.message);
   }
}

async function getUserNFTs(uidUrl) {
   try {
      const response = await fetch(`https://ev.io/flags/${uidUrl}`);
      const data = await response.json();

      if (!response.ok) {
         throw new Error(`Failed to fetch user NFTs. Status: ${response.status}, ${response.statusText}`);
      }

      return data;
   } catch (error) {
      console.error('Error fetching user NFTs:', error.message);
      return null;
   }
}

async function getSkinInfo(entityId) {
   try {
      const response = await fetch(`https://ev.io/node/${entityId}?_format=json`);
      const data = await response.json();

      if (!response.ok) {
         throw new Error(`Failed to fetch skin info. Status: ${response.status}, ${response.statusText}`);
      }

      return data;
   } catch (error) {
      console.error('Error fetching skin info:', error.message);
      return null;
   }
}

async function displayUserNFTs(currentPage = 1) {
   const nftContainer = document.getElementById('nftContainer');
   nftContainer.innerHTML = '';

   const pagination = document.getElementById('pagination');
   pagination.innerHTML = '';

   try {
      const uidUrl = await fetchUserUid();
      if (!uidUrl) {
         return;
      }

      const loadingSpinner = document.createElement('div');
      loadingSpinner.classList.add('spinner', 'mx-auto');
      pagination.appendChild(loadingSpinner);

      const userNFTs = await getUserNFTs(uidUrl);

      if (userNFTs) {
         loadingSpinner.remove();

         const totalPages = Math.ceil(userNFTs.length / pageSize);

         const pageButtons = [];
         const displayedPages = [];

         for (let page = 1; page <= totalPages; page++) {
            if (page <= 2 || page >= totalPages - 1 || Math.abs(page - currentPage) <= 1) {
               const pageButton = document.createElement('button');
               pageButton.textContent = page;
               pageButton.classList.add('mx-1', 'btn', 'backdrop-sepia-0', 'shadow-md', 'shadow-[#7289da]', 'rounded-lg', 'normal-case');
               pageButton.onclick = () => displayUserNFTs(page);
               pageButtons.push(pageButton);
               displayedPages.push(page);
            } else if (!displayedPages.includes('...')) {
               const ellipsisButton = document.createElement('button');
               ellipsisButton.textContent = '...';
               ellipsisButton.classList.add('mx-1', 'btn', 'backdrop-sepia-0', 'shadow-md', 'shadow-[#7289da]', 'rounded-lg', 'normal-case');
               ellipsisButton.onclick = () => replaceEllipsisWithInputField(ellipsisButton, currentPage, totalPages);
               pageButtons.push(ellipsisButton);
               displayedPages.push('...');
            }
         }

         if (!displayedPages.includes(totalPages - 1)) {
            const pageButton = document.createElement('button');
            pageButton.textContent = totalPages - 1;
            pageButton.classList.add('mx-1', 'btn', 'backdrop-sepia-0', 'shadow-md', 'shadow-[#7289da]', 'rounded-lg', 'normal-case');
            pageButton.onclick = () => displayUserNFTs(totalPages - 1);
            pageButtons.push(pageButton);
         }

         if (!displayedPages.includes(totalPages)) {
            const pageButton = document.createElement('button');
            pageButton.textContent = totalPages;
            pageButton.classList.add('mx-1', 'btn', 'backdrop-sepia-0', 'shadow-md', 'shadow-[#7289da]', 'rounded-lg', 'normal-case');
            pageButton.onclick = () => displayUserNFTs(totalPages);
            pageButtons.push(pageButton);
         }

         pagination.append(...pageButtons);

         displayPageNFTs(userNFTs.slice((currentPage - 1) * pageSize, currentPage * pageSize), currentPage, totalPages);
      } else {
         const errorMessage = document.createElement('div');
         errorMessage.textContent = 'Failed to fetch user NFTs. Please try again later.';
         errorMessage.classList.add('text-red-500');
         pagination.appendChild(errorMessage);
      }
   } catch (error) {
      console.error('Error displaying user NFTs:', error.message);
   }
}

function replaceEllipsisWithInputField(ellipsisButton, currentPage, totalPages) {
   const inputField = document.createElement('input');
   inputField.min = 1;
   inputField.max = totalPages;
   inputField.value = currentPage;
   inputField.classList.add('mx-1', 'backdrop-sepia-0', 'shadow-md', 'shadow-[#7289da]', 'rounded-lg', 'normal-case', "text-center", "justify-center", "mb-[-10px]", "items-center");
   inputField.style.width = '3rem';
   inputField.style.height = '35px';
   inputField.style.textAlign = 'center';
   inputField.style.backgroundColor = 'hsl(var(--n)/var(--tw-border-opacity))';
   inputField.addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
         const newPage = parseInt(event.target.value);
         if (newPage >= 1 && newPage <= totalPages) {
            displayUserNFTs(newPage);
         }
      }
   });
   ellipsisButton.replaceWith(inputField);
}


async function displayPageNFTs(paginatedNFTs, currentPage, totalPages) {
   const nftContainer = document.getElementById('nftContainer');
   nftContainer.innerHTML = '';

   const pageIndicator = document.getElementById('pageIndicator');

   if (currentPage !== undefined && totalPages !== undefined) {
      pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
   } else {
      pageIndicator.textContent = '';
   }

   if (paginatedNFTs.length === 0) {
      showToast('User has no NFTs.' , 'danger');
   } else {
      for (const nftData of paginatedNFTs) {
         const nftCard = document.createElement('div');
         nftCard.classList.add('nft-card');

         const nftImage = document.createElement('img');
         nftImage.classList.add('nft-image');

         try {
            const imageUrl = `https://ev.io${nftData.field_wallet_image}`;

            nftCard.appendChild(nftImage);

            const skinInfoBox = document.createElement('div');
            skinInfoBox.classList.add('skin-info-box');

            const skinInfo = document.createElement('div');
            skinInfo.classList.add('skin-info');
            skinInfo.innerHTML = `
               
               <div class="flex flex-col items-center justify-center backdrop-sepia-0 shadow-lg shadow-[#7289da] rounded-lg h-[200px]">
                   <img src="${imageUrl}" alt="NFT Image" class="h-[100px] w-auto rounded-lg mb-4">
                   <div class="text-center"><strong>Name:</strong> ${nftData.field_skin || 'Unknown'}</div>
                   <div class="text-center"><strong>NFT Token:</strong> <a target="_blank" href="https://solscan.io/token/${nftData.field_flag_nft_address}">${truncateToken(nftData.field_flag_nft_address) || 'Unknown'}</a></div>
                   <div class="text-center"><strong>Skin Node ID:</strong> ${nftData.entity_id || 'Unknown'}</div>
               </div>
               `;

            skinInfoBox.appendChild(skinInfo);
            nftCard.appendChild(skinInfoBox);

            nftContainer.appendChild(nftCard);
         } catch (parseError) {
            console.error('Error parsing NFT data:', parseError.message);

            try {
               const skinData = await getSkinInfo(nftData.entity_id);
               let imageUrl = null;

               if (skinData.field_profile_thumb) {
                  imageUrl = skinData.field_profile_thumb[0].url;
               } else if (skinData.field_weapon_skin_thumb) {
                  imageUrl = skinData.field_weapon_skin_thumb[0].url;
               }

               const skinInfoBox = document.createElement('div');
               skinInfoBox.classList.add('skin-info-box');

               const skinInfo = document.createElement('div');
               skinInfo.classList.add('skin-info');
               skinInfo.innerHTML = `

                   <div class="flex flex-col items-center justify-center backdrop-sepia-0 shadow-lg shadow-[#7289da] rounded-lg h-[200px]">
                       <img src="${imageUrl}" class="max-h-40 max-w-40 rounded-lg mb-4">
                       <div class="text-center"><strong>Node ID:</strong> ${nftData.entity_id || 'Unknown'}</div>
                       <div class="text-center"><strong>Title:</strong> ${skinData?.title[0]?.value || 'Unknown'}</div>
                   </div>


                   `;

               skinInfoBox.appendChild(skinInfo);
               nftCard.appendChild(skinInfoBox);

               nftContainer.appendChild(nftCard);
            } catch (error) {
               console.error('Error parsing NFT data:', error.message);
            }
         }
      }
   }
}

document.getElementById('usernameInputnft').addEventListener('keypress', (event) => {
   if (event.key === 'Enter') {
      displayUserNFTs();
   }
});


function truncateToken(token) {
   return `${token.substring(0, 5)}...${token.substring(token.length - 5)}`;
}

function selectToken(element) {
   const selection = window.getSelection();
   const range = document.createRange();
   range.selectNodeContents(element);
   selection.removeAllRanges();
   selection.addRange(range);
}


document.getElementById('nftIdInput').addEventListener('keypress', (event) => {
   if (event.key === 'Enter') {
      searchNFT();
   }
});

const searchButton = document.getElementById('searchButton');

searchButton.addEventListener('click', () => {
   searchNFT();
});

function searchNFT() {
   const outputDiv = document.getElementById('output');
   const nftIdInput = document.getElementById('nftIdInput');

   const nftId = nftIdInput.value.trim();
   if (!nftId) {
      showToast('Please enter an NFT ID.', 'danger');
      return;
   }

   outputDiv.innerHTML = '';

   const api_url = `https://ev.io/get-nft-flags/${nftId}`;

   fetch(api_url)
      .then(response => {
         if (!response.ok) {
            throw new Error('Network response was not ok');
         }
         return response.json();
      })
      .then(data => {
         const reset_time = data[0]["field_reset_time"];
         const field_meta = JSON.parse(data[0]["field_meta"][0]);

         const skin_name = field_meta["value"]["name"];
         const thumbnail = field_meta["value"]["image"];

         let game_node_id = null;
         const attributes = field_meta["value"]["attributes"];
         for (const attribute of attributes) {
            if (attribute["trait_type"] === "game-node-id") {
               game_node_id = attribute["value"];
               break;
            }
         }

         let weapon_type = null;
         for (const attribute of attributes) {
            if (attribute["trait_type"] === "tier") {
               weapon_type = attribute["value"];
               break;
            }
         }

         let collection = null;
         for (const attribute of attributes) {
            if (attribute["family"] === "EV.IO") {
               collection = attribute["value"];
               break;
            }
         }

         const infoContainer = document.createElement('div');

         const thumbnailImage = document.createElement('img');

         infoContainer.appendChild(thumbnailImage);
         const uidUrl = `https://ev.io/node/${game_node_id}`;
         infoContainer.innerHTML += `
           <div class="flex flex-col justify-center items-center backdrop-sepia-0 shadow-lg shadow-[#7289da] rounded-lg p-4">
           <img src="${thumbnail}" class="max-h-40 max-w-40 rounded-lg mb-4">
           <p class="text-center"><strong>Skin Name:</strong> ${skin_name}</p>
           <p class="text-center"><strong>Game Node URL:</strong> <a href="${uidUrl}" target="_blank">${uidUrl}</a></p>
           <p class="text-center"><strong>Weapon Type:</strong> ${weapon_type}</p>
           <p class="text-center"><strong>Reset Time:</strong> ${reset_time}</p>
           <p class="text-center"><strong>Collection:</strong> ${collection}</p>
       </div>
       
               `;

         outputDiv.appendChild(infoContainer);
      })
      .catch(error => {
         console.error('Error:', error);
         showToast('Invalid ID', 'danger');
      });
}

const urlParams = new URLSearchParams(window.location.search);
const nft_lookup = urlParams.get('nft_lookup');

if (nft_lookup) {
   document.getElementById('nftIdInput').value = nft_lookup;
   searchNFT();
   document.getElementById('nftid-lookup').scrollIntoView({
      behavior: 'smooth'
   });
}


let icon = {
   danger: '<i class="fa-solid fa-circle-exclamation"></i>'
};

const showToast = (message = "Sample Message", toastType = "info", duration = 5000) => {
   if (!Object.keys(icon).includes(toastType)) toastType = "info";

   let box = document.createElement("div");
   box.classList.add("toast", `toast-${toastType}`, "p-6", "rounded-lg", "shadow-lg", "shadow-[#7289da]", 'backdrop-sepia-0');
   box.innerHTML = `
      <div class="toast-content-wrapper flex justify-between items-center">
         <div class="toast-icon p-1">
            ${icon[toastType]}
         </div>
         <div class="toast-message flex-1 text-base p-2">
            ${message}
         </div>
         <div class="toast-progress h-1 bg-gray-400"></div>
      </div>
   `;
   duration = duration || 5000;
   box.querySelector(".toast-progress").style.animationDuration = `${duration / 5000}m`;

   let toastAlready = document.body.querySelector(".toast");
   if (toastAlready) {
      toastAlready.remove();
   }

   document.body.appendChild(box)
};

var isAudioPlaying = false;

function playAudio() {
    if (!isAudioPlaying) {
        var audioUrl = "https://github.com/ev-discord-bot/ev-info/raw/main/src/the_music.mp3";
        var audioElement = new Audio(audioUrl);
        audioElement.play();
        isAudioPlaying = true;
        document.querySelector('.scrolling-text').style.pointerEvents = 'none';
        audioElement.addEventListener('ended', function() {
            audioElement.pause();
            document.querySelector('.scrolling-text').style.pointerEvents = 'auto';
        });
        document.querySelector('#logo-image').addEventListener('click', function() {
            isAudioPlaying = false;
        });
    }
}
