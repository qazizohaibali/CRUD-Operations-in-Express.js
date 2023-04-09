import { useFormik } from 'formik'
import * as yup from 'yup'
import axios from 'axios'
import { useEffect } from 'react';
import { useState } from 'react';
// import { response } from 'express'


function App() {

  const [products, setProducts] = useState([])
  const [load, setLoad] = useState(false)
  const [iseditmode, setIsditmode] = useState(false)
  const [editingproduct, setEditingproduct] = useState(null)

/////_____FORM FOR ADDING PRODUCT_____/////

  const myFormik = useFormik({
    initialValues: {
      productName: '',
      productPrice: '',
      productDescription: ''
    },

    validationSchema: ////// FORNTEND VALIDATION //////
      yup.object({
        productName: yup
          .string('Enter Your Product Name')
          .required('Product name is required')
          .min(3, 'more than 3 characters are required')
          .max(20, 'within 20 characters are required'),
        productPrice: yup
          .number('Enter Your Product Price')
          .required('Product Price is required')
          .positive("Enter valid price"),
        productDescription: yup
          .string('Enter Your Product Description')
          .required('Product description is required')
          .min(3, 'more than 3 characters are required')
          .max(500, 'within 20 characters are required')
      }),
    onSubmit: (values) => {
      console.log("values :", values);
      axios.post(`http://localhost:4001/product`, {
        ////// BACKENED VALIDATION ////// 
        name: values.productName,
        price: values.productPrice,
        description: values.productDescription,
      })
        .then(response => {
          console.log("response :", response.data)
          setLoad(!load)
        })
        .catch(err => {
          console.log("error :", err)
        })
    }
  })


/////_____FORM FOR EDITING PRODUCT_____/////


  const editFormik = useFormik({
    initialValues: {
      productName: '',
      productPrice: '',
      productDescription: ''
    },

   

    validationSchema: ////// FORNTEND VALIDATION //////
      yup.object({
        productName: yup
          .string('Enter Your Product Name')
          .required('Product name is required')
          .min(3, 'more than 3 characters are required')
          .max(20, 'within 20 characters are required'),
        productPrice: yup
          .number('Enter Your Product Price')
          .required('Product Price is required')
          .positive("Enter valid price"),
        productDescription: yup
          .string('Enter Your Product Description')
          .required('Product description is required')
          .min(3, 'more than 3 characters are required')
          .max(500, 'within 20 characters are required')
      }),
    onSubmit: (values) => {
      console.log("values :", values);
      axios.put(`http://localhost:4001/product/${editingproduct.id}`, {
        ////// BACKENED VALIDATION ////// 
        name: values.productName,
        price: values.productPrice,
        description: values.productDescription,
      })
      .then(response => {
        console.log("response :", response.data)
        setLoad(!load)
      })
      .catch(err => {
        console.log("error :", err)
      })
      setIsditmode(!iseditmode)
    }
  })



  ///// LOGIC FOR DISPLAYING ALL PRODUCTS ON PAGE WHEN WE OPEN IT

  const getAllproducts = async () => {
    try {
      const response = await axios.get('http://localhost:4001/products')
      console.log("RESPONSE :", response)
      setProducts(response.data.data)



    } catch (error) {
      console.log("error in getting product", error)
    }
  }

  useEffect(() => {
    getAllproducts()
  }, [load])

  ///// END OF DIPLAYING PRODUCT's LOGIC 


  ///// LOGIC FOR DELETE PRODUCT

  const deleteHandle = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:4001/product/${id}`)
      console.log("response", response.data)
      setLoad(!load)
    }
    catch (error) {
      console.log("error in Deleting products", error)
    }
  }

  ///// LOGIC FOR EDIT PRODUCT ///// 

  const editMode = (product) => {
    setIsditmode(!iseditmode)
    setEditingproduct(product)

    editFormik.setFieldValue("PRODUCT NAME",product.name)
    editFormik.setFieldValue("PRODUCT PRICE",product.price)
    editFormik.setFieldValue("PRODUCT DESCRIPTION",product.description)
  }


  return (
    <div style={{ textAlign: "center" }}>
      <form onSubmit={myFormik.handleSubmit}>
        <input
          id='productName'
          placeholder='Product Name'
          value={myFormik.values.productName}
          onChange={myFormik.handleChange}
        />
        {
          (myFormik.touched.productName && Boolean(myFormik.errors.productName)) ? <span style={{ color: 'red' }}>{myFormik.errors.productName}</span> : null
        }

        <br />

        <input
          id='productPrice'
          placeholder='Product Price'
          value={myFormik.values.productPrice}
          onChange={myFormik.handleChange}
        />
        {
          (myFormik.touched.productPrice && Boolean(myFormik.errors.productPrice)) ? <span style={{ color: 'red' }}>{myFormik.errors.productPrice}</span> : null
        }

        <br />

        <input
          id='productDescription'
          placeholder='Product Description'
          value={myFormik.values.productDescription}
          onChange={myFormik.handleChange}
        />
        {
          (myFormik.touched.productDescription && Boolean(myFormik.errors.productDescription)) ? <span style={{ color: 'red' }}>{myFormik.errors.productDescription}</span> : null
        }

        <br />

        <button type="submit">Submit</button>

      </form>


      <br />
      <br />
      <br />
      <div>
        {products.map((eachproduct, i) =>
        (
          <div key={eachproduct.id} style={{ textAlign: "center" }}>
            <h1>Product Name: {eachproduct.name}</h1>
            <h3>Product Id: {eachproduct.id}</h3>
            <h2>Description: {eachproduct.description}</h2>
            <h3>Price: {eachproduct.price}</h3>
            <button onClick={() => { deleteHandle(eachproduct.id) }}>Delete</button>
            <button onClick={() => { editMode(eachproduct) }}>Edit</button>

            {(iseditmode && editingproduct.id === eachproduct.id) ? <div>

              <form onSubmit={editFormik.handleSubmit}>
                <input
                  id='productName'
                  placeholder='Product Name'
                  value={editFormik.values.productName}
                  onChange={editFormik.handleChange}
                />
                {
                  (editFormik.touched.productName && Boolean(editFormik.errors.productName)) ? <span style={{ color: 'red' }}>{editFormik.errors.productName}</span> : null
                }

                <br />

                <input
                  id='productPrice'
                  placeholder='Product Price'
                  value={editFormik.values.productPrice}
                  onChange={editFormik.handleChange}
                />
                {
                  (editFormik.touched.productPrice && Boolean(editFormik.errors.productPrice)) ? <span style={{ color: 'red' }}>{editFormik.errors.productPrice}</span> : null
                }

                <br />

                <input
                  id='productDescription'
                  placeholder='Product Description'
                  value={editFormik.values.productDescription}
                  onChange={editFormik.handleChange}
                />
                {
                  (editFormik.touched.productDescription && Boolean(editFormik.errors.productDescription)) ? <span style={{ color: 'red' }}>{editFormik.errors.productDescription}</span> : null
                }

                <br />

                <button type="submit">Submit</button>

              </form>

            </div> : null}

          </div>
        ))
        }

      </div>
    </div>
  );
}

export default App;
