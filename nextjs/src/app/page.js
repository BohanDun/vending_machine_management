"use client";

import { useContext, useState, useEffect } from 'react';
import AuthContext from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import axios from 'axios';

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [machines, setMachines] = useState([]);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [machineName, setMachineName] = useState('');
  const [machineDescription, setMachineDescription] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProductByMachine, setSelectedProductByMachine] = useState({});
  const [selectedProductQuantityByMachine, setSelectedProductQuantityByMachine] = useState({});
  const [deleteQuantityByMachineProduct, setDeleteQuantityByMachineProduct] = useState({});
  const [addQuantityByMachineProduct, setAddQuantityByMachineProduct] = useState({});

  const getAuth = () => {
    const raw = sessionStorage.getItem('token');
    if (!raw) return {};
    let token = raw;
    try {
      const parsed = JSON.parse(raw);
      token = parsed.access_token ?? parsed.token ?? raw;
    } catch {}
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const fetchProductsAndMachines = async () => {
      try {
        const raw = sessionStorage.getItem('token');
        if (!raw) return;
        let token = raw;
        try {
          const parsed = JSON.parse(raw);
          token = parsed.access_token ?? parsed.token ?? raw;
        } catch {}
        const auth = { headers: { Authorization: `Bearer ${token}` } };

        const [productsResponse, machinesResponse] = await Promise.all([
          axios.get('http://localhost:8000/products/', auth),
          axios.get('http://localhost:8000/machines/', auth),
        ]);
        setProducts(productsResponse.data);
        setMachines(machinesResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchProductsAndMachines();
  }, []);

  const refreshProductsAndMachines = async () => {
    const auth = getAuth();
    const [productsResponse, machinesResponse] = await Promise.all([
      axios.get('http://localhost:8000/products/', auth),
      axios.get('http://localhost:8000/machines/', auth),
    ]);
    setProducts(productsResponse.data);
    setMachines(machinesResponse.data);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:8000/products/',
        {
          name: productName,
          description: productDescription,
          quantity: Number(productQuantity),
          price: productPrice,
        },
        getAuth()
      );
      setProductName('');
      setProductDescription('');
      setProductQuantity('');
      setProductPrice('');
      await refreshProductsAndMachines();
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  const handleCreateMachine = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:8000/machines/',
        { name: machineName, description: machineDescription, products: selectedProducts.map(Number) },
        getAuth()
      );
      setMachineName('');
      setMachineDescription('');
      setSelectedProducts([]);
      await refreshProductsAndMachines();
    } catch (error) {
      console.error('Failed to create machine:', error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/products/${id}`, getAuth());
      setProducts((prev) => prev.filter((product) => product.id !== id));
      setSelectedProducts((prev) => prev.filter((productId) => productId !== id));
      setMachines((prev) =>
        prev.map((machine) => ({
          ...machine,
          products: (machine.products || []).filter((product) => product.id !== id),
        }))
      );
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const deleteMachine = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/machines/${id}`, getAuth());
      await refreshProductsAndMachines();
    } catch (error) {
      console.error('Failed to delete machine:', error);
    }
  };

  const addProductToMachine = async (machineId) => {
    const productId = selectedProductByMachine[machineId];

    if (!productId) return;

    try {
      await axios.post(
        `http://localhost:8000/machines/${machineId}/products/${productId}`,
        { quantity: Number(selectedProductQuantityByMachine[machineId] || 0) },
        getAuth()
      );

      await refreshProductsAndMachines();

      setSelectedProductByMachine((prev) => ({
        ...prev,
        [machineId]: '',
      }));
      setSelectedProductQuantityByMachine((prev) => ({
        ...prev,
        [machineId]: '',
      }));
    } catch (error) {
      console.error('Failed to add product to machine:', error);
    }
  };

  const removeProductFromMachine = async (machineId, productId) => {
    try {
      await axios.delete(
        `http://localhost:8000/machines/${machineId}/products/${productId}`,
        getAuth()
      );

      await refreshProductsAndMachines();
    } catch (error) {
      console.error('Failed to remove product from machine:', error);
    }
  };

  const deleteMachineProductQuantity = async (machineId, productId) => {
    const key = `${machineId}-${productId}`;
    const quantity = Number(deleteQuantityByMachineProduct[key] || 0);

    if (quantity <= 0) return;

    try {
      await axios.post(
        `http://localhost:8000/machines/${machineId}/products/${productId}/delete-quantity`,
        { quantity },
        getAuth()
      );
      await refreshProductsAndMachines();
      setDeleteQuantityByMachineProduct((prev) => ({
        ...prev,
        [key]: '',
      }));
    } catch (error) {
      console.error('Failed to delete machine product quantity:', error);
    }
  };

  const addMachineProductQuantity = async (machineId, product) => {
    const key = `${machineId}-${product.id}`;
    const quantity = Number(addQuantityByMachineProduct[key] || 0);

    if (quantity <= 0) return;

    try {
      await axios.put(
        `http://localhost:8000/machines/${machineId}/products/${product.id}/quantity`,
        { quantity: (product.machine_quantity || 0) + quantity },
        getAuth()
      );
      await refreshProductsAndMachines();
      setAddQuantityByMachineProduct((prev) => ({
        ...prev,
        [key]: '',
      }));
    } catch (error) {
      console.error('Failed to add machine product quantity:', error);
    }
  };

  const updateMachineProductQuantity = async (machineId, productId, quantity) => {
    try {
      await axios.put(
        `http://localhost:8000/machines/${machineId}/products/${productId}/quantity`,
        { quantity: Number(quantity) },
        getAuth()
      );
      await refreshProductsAndMachines();
    } catch (error) {
      console.error('Failed to update machine product quantity:', error);
    }
  };

  const updateProductPrice = async (productId, price) => {
    try {
      await axios.put(
        `http://localhost:8000/products/${productId}/price`,
        { price },
        getAuth()
      );
      await refreshProductsAndMachines();
    } catch (error) {
      console.error('Failed to update product price:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container">
        <h1>Welcome!</h1>
        <button onClick={logout} className="btn btn-danger">Logout</button>

        <div className="accordion mt-5 mb-5" id="accordionExample">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                Create Product
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <form onSubmit={handleCreateProduct}>
                  <div className="mb-3">
                    <label htmlFor="productName" className="form-label">Product Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="productName"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="productDescription" className="form-label">Product Description</label>
                    <input
                      type="text"
                      className="form-control"
                      id="productDescription"
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="productQuantity" className="form-label">Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      id="productQuantity"
                      value={productQuantity}
                      onChange={(e) => setProductQuantity(e.target.value)}
                      min="0"
                      step="1"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="productPrice" className="form-label">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      id="productPrice"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Create Product</button>
                </form>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingTwo">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                Create Machine
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <form onSubmit={handleCreateMachine}>
                  <div className="mb-3">
                    <label htmlFor="machineName" className="form-label">Machine Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="machineName"
                      value={machineName}
                      onChange={(e) => setMachineName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="machineDescription" className="form-label">Machine Description</label>
                    <input
                      type="text"
                      className="form-control"
                      id="machineDescription"
                      value={machineDescription}
                      onChange={(e) => setMachineDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="productSelect" className="form-label">Select Products</label>
                    <select
                      multiple
                      className="form-control"
                      id="productSelect"
                      value={selectedProducts}
                      onChange={(e) => setSelectedProducts([...e.target.selectedOptions].map(o => Number(o.value)))}
                    >
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">Create Machine</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h3 className="mb-0">Your products:</h3>
            <span className="badge text-bg-secondary">{products.length} registered</span>
          </div>

          {products.length === 0 ? (
            <div className="alert alert-secondary mb-0" role="status">
              No products registered for this account yet.
            </div>
          ) : (
            <div className="list-group">
              {products.map((product) => (
                <div
                  className="list-group-item d-flex align-items-start justify-content-between gap-3"
                  key={product.id}
                >
                  <div>
                    <h5 className="mb-1">{product.name}</h5>
                    <p className="mb-1 text-body-secondary">
                      {product.description || 'No description'}
                    </p>
                    <div className="d-flex flex-wrap gap-3 mb-1">
                      <small className="text-body-secondary">
                        Total quantity: {Number(product.quantity || 0) + Number(product.machine_quantity_total || 0)}
                      </small>
                      <label className="d-flex align-items-center gap-2 text-body-secondary">
                        <small>Price:</small>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          style={{ maxWidth: '120px' }}
                          min="0"
                          step="0.01"
                          defaultValue={Number(product.price).toFixed(2)}
                          onBlur={(e) => updateProductPrice(product.id, e.target.value)}
                        />
                      </label>
                      <small className="text-body-secondary">
                        In machines: {product.machine_quantity_total || 0}
                      </small>
                    </div>
                    {(product.machine_quantities || []).length === 0 ? (
                      <small className="text-body-secondary">Not assigned to any machine</small>
                    ) : (
                      <ul className="mb-0 ps-3">
                        {(product.machine_quantities || []).map((machineQuantity) => (
                          <li className="text-body-secondary" key={machineQuantity.machine_id}>
                            <small>
                              {machineQuantity.machine_name}: {machineQuantity.quantity}
                            </small>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger flex-shrink-0"
                    onClick={() => deleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3>Your machines:</h3>
          <div className="d-flex flex-column gap-3">
            {machines.map(machine => (
              <div className="card" key={machine.id}>
                <div className="card-body">
                  <button type="button" className="btn btn-sm btn-outline-danger float-end" onClick={() => deleteMachine(machine.id)}>Delete</button>
                  <h5 className="card-title">{machine.name}</h5>
                  <p className="card-text">{machine.description}</p>
                  <ul className="card-text">
                    {machine.products && machine.products.map(product => (
                      <li key={product.id}>
                        <div className="d-flex flex-wrap align-items-center gap-2">
                          <span>
                            {product.name}: {product.description} - Total: {product.quantity}, In this machine: {product.machine_quantity || 0}, Price: ${Number(product.price).toFixed(2)}
                          </span>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            style={{ maxWidth: '110px' }}
                            min="0"
                            step="1"
                            defaultValue={product.machine_quantity || 0}
                            onBlur={(e) =>
                              updateMachineProductQuantity(machine.id, product.id, e.target.value)
                            }
                          />
                        </div>
                        <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            style={{ maxWidth: '120px' }}
                            min="1"
                            step="1"
                            placeholder="Add qty"
                            value={addQuantityByMachineProduct[`${machine.id}-${product.id}`] || ''}
                            onChange={(e) =>
                              setAddQuantityByMachineProduct((prev) => ({
                                ...prev,
                                [`${machine.id}-${product.id}`]: e.target.value,
                              }))
                            }
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-success"
                            onClick={() => addMachineProductQuantity(machine.id, product)}
                            disabled={!addQuantityByMachineProduct[`${machine.id}-${product.id}`]}
                          >
                            Add Quantity
                          </button>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            style={{ maxWidth: '120px' }}
                            min="1"
                            step="1"
                            placeholder="Delete qty"
                            value={deleteQuantityByMachineProduct[`${machine.id}-${product.id}`] || ''}
                            onChange={(e) =>
                              setDeleteQuantityByMachineProduct((prev) => ({
                                ...prev,
                                [`${machine.id}-${product.id}`]: e.target.value,
                              }))
                            }
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteMachineProductQuantity(machine.id, product.id)}
                            disabled={!deleteQuantityByMachineProduct[`${machine.id}-${product.id}`]}
                          >
                            Delete Quantity
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => removeProductFromMachine(machine.id, product.id)}
                          >
                            Remove All
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="d-flex gap-2 mt-3">
                    <select
                      className="form-select"
                      value={selectedProductByMachine[machine.id] || ''}
                      onChange={(e) =>
                        setSelectedProductByMachine((prev) => ({
                          ...prev,
                          [machine.id]: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select product</option>
                      {products
                        .filter(
                          (product) =>
                            !(machine.products || []).some(
                              (machineProduct) => machineProduct.id === product.id
                            )
                        )
                        .map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                    </select>

                    <input
                      type="number"
                      className="form-control"
                      style={{ maxWidth: '140px' }}
                      min="0"
                      step="1"
                      placeholder="Quantity"
                      value={selectedProductQuantityByMachine[machine.id] || ''}
                      onChange={(e) =>
                        setSelectedProductQuantityByMachine((prev) => ({
                          ...prev,
                          [machine.id]: e.target.value,
                        }))
                      }
                    />

                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => addProductToMachine(machine.id)}
                      disabled={!selectedProductByMachine[machine.id]}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Home;
