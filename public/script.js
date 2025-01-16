// URL da API
const apiURL = 'http://localhost:3000/items';

// Função para buscar e exibir o estoque
async function fetchInventory() {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        // Limpar a tabela
        const inventoryTable = document.getElementById('inventoryTable');
        inventoryTable.innerHTML = '';

        // Preencher a tabela com os itens do estoque
        data.data.forEach(item => {
            const row = inventoryTable.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);

            cell1.textContent = item.name;
            cell2.textContent = item.quantity;
        });
    } catch (error) {
        console.error('Erro ao buscar o estoque:', error);
        alert('Erro ao carregar o estoque. Tente novamente mais tarde.');
    }
}

// Função para adicionar um item ao estoque
async function addItem() {
    const itemName = document.getElementById('itemName').value.trim();
    const itemQuantity = parseInt(document.getElementById('itemQuantity').value.trim(), 10);

    if (!itemName || isNaN(itemQuantity) || itemQuantity <= 0) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    try {
        const response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: itemName, quantity: itemQuantity }),
        });

        if (response.ok) {
            alert('Item adicionado com sucesso!');
            document.getElementById('itemName').value = '';
            document.getElementById('itemQuantity').value = '';
            fetchInventory(); // Atualizar a tabela com o estoque atualizado
        } else {
            const error = await response.json();
            alert(`Erro ao adicionar item: ${error.error}`);
        }
    } catch (error) {
        console.error('Erro ao adicionar item:', error);
        alert('Erro ao adicionar item. Tente novamente mais tarde.');
    }
}

// Buscar o estoque ao carregar a página
document.addEventListener('DOMContentLoaded', fetchInventory);
