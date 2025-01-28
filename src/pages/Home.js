import React, { useState, useEffect } from 'react';
import { OrderService } from '../services/api';

const OrderManagementApp = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newOrder, setNewOrder] = useState({
    items: [],
    selectedProduct: '',
    quantity: 1
  });

  const customer = {
    id: 1,
    name: 'Cliente Padrão',
    email: 'cliente@exemplo.com',
    phone: '(11) 99999-9999'
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [productsData, ordersData] = await Promise.all([
          OrderService.getAllProducts(),
          OrderService.getAllOrders()
        ]);
        setProducts(productsData);
        setOrders(ordersData);
      } catch (error) {
        alert("Erro ao carregar dados iniciais");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const addItemToOrder = () => {
    if (!newOrder.selectedProduct) return;

    const product = products.find(p => p.id === parseInt(newOrder.selectedProduct));
    const item = {
      productId: product.id,
      productName: product.name,
      quantity: newOrder.quantity,
      unitPrice: product.price,
      totalPrice: product.price * newOrder.quantity
    };

    setNewOrder(prev => ({
      ...prev,
      items: [...prev.items, item],
      selectedProduct: '',
      quantity: 1
    }));
  };

  const submitOrder = async () => {
    try {
      setLoading(true);
      const orderData = {
        customerId: customer.id,
        orderDate: new Date().toISOString(),
        totalAmount: newOrder.items.reduce((sum, item) => sum + item.totalPrice, 0),
        status: 'Pending',
        items: newOrder.items
      };

      const createdOrder = await OrderService.createOrder(orderData);
      setOrders(prev => [...prev, createdOrder]);
      setNewOrder({ items: [], selectedProduct: '', quantity: 1 });
      alert("Pedido criado com sucesso!");
    } catch (error) {
      alert("Erro ao criar pedido");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md mb-6 p-6">
        <h2 className="text-2xl font-bold mb-4">Novo Pedido</h2>
        <div className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block mb-2">Produto</label>
              <select 
                className="w-full p-2 border rounded"
                value={newOrder.selectedProduct}
                onChange={(e) => setNewOrder(prev => ({
                  ...prev,
                  selectedProduct: e.target.value
                }))}
              >
                <option value="">Selecione um produto</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - R$ {product.price}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-32">
              <label className="block mb-2">Quantidade</label>
              <input
                type="number"
                min="1"
                className="w-full p-2 border rounded"
                value={newOrder.quantity}
                onChange={(e) => setNewOrder(prev => ({
                  ...prev,
                  quantity: parseInt(e.target.value) || 1
                }))}
              />
            </div>
            <button 
              onClick={addItemToOrder}
              disabled={!newOrder.selectedProduct}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Adicionar Item
            </button>
          </div>

          <div>
            <h3 className="font-medium mb-2">Itens do Pedido:</h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Produto</th>
                  <th className="text-right">Qtd</th>
                  <th className="text-right">Preço Unit.</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {newOrder.items.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2">{item.productName}</td>
                    <td className="text-right">{item.quantity}</td>
                    <td className="text-right">R$ {item.unitPrice}</td>
                    <td className="text-right">R$ {item.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t font-medium">
                  <td colSpan={3} className="py-2">Total do Pedido:</td>
                  <td className="text-right">
                    R$ {newOrder.items.reduce((sum, item) => sum + item.totalPrice, 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <button 
            onClick={submitOrder}
            disabled={newOrder.items.length === 0 || loading}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            Finalizar Pedido
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Pedidos Realizados</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">ID</th>
              <th className="text-left">Data</th>
              <th className="text-right">Total</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-t">
                <td className="py-2">{order.id}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td className="text-right">R$ {order.totalAmount}</td>
                <td className="text-center">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagementApp;