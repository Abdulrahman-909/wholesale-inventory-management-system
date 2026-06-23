import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/Button.jsx'
import { Input } from '../components/Input.jsx'
import { get, getErrorMessage } from '../services/api.js'
import {
  createProduct,
  fetchProductById,
  updateProduct,
} from '../services/productService.js'

const initialForm = {
  name: '',
  category: '',
  unit_price: '',
  initial_quantity: '',
  image: null,
}

function validate(values, isEditMode) {
  const errors = {}

  const name = values.name.trim()
  if (!name) errors.name = 'Name is required.'
  else if (name.length < 2) errors.name = 'Name must be at least 2 characters.'

  if (!values.category) errors.category = 'Category is required.'

  const priceRaw = values.unit_price.trim()
  if (!priceRaw) errors.unit_price = 'Price is required.'
  else {
    const price = Number(priceRaw)
    if (Number.isNaN(price) || price < 0) {
      errors.unit_price = 'Enter a valid price 0 or more.'
    }
  }

  if (!isEditMode) {
    const quantityRaw = values.initial_quantity.trim()
    if (!quantityRaw) errors.initial_quantity = 'Initial quantity is required.'
    else {
      const quantity = Number(quantityRaw)
      if (Number.isNaN(quantity) || quantity < 0 || !Number.isInteger(quantity)) {
        errors.initial_quantity = 'Enter a whole number 0 or greater.'
      }
    }
  }

  return errors
}

export function AddProduct() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = Boolean(id)

  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingProduct, setLoadingProduct] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function loadCategories() {
      setLoadingCategories(true)

      try {
        const response = await get('categories/')
        const data = Array.isArray(response.data) ? response.data : []
        setCategories(data)

        if (data.length === 0) {
          setSubmitError('No categories found. Please create a category first.')
        }
      } catch (err) {
        console.error('Category loading error:', err.response?.status, err.response?.data)
        setSubmitError(getErrorMessage(err))
        setCategories([])
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

  useEffect(() => {
    if (!isEditMode) return

    async function loadProduct() {
      setLoadingProduct(true)
      setSubmitError('')

      try {
        const product = await fetchProductById(id)

        setForm({
          name: product.name ?? '',
          category: String(product.category ?? ''),
          unit_price: String(product.unit_price ?? ''),
          initial_quantity: '',
          image: null,
        })
      } catch (err) {
        console.error('Product loading error:', err.response?.status, err.response?.data)
        setSubmitError(getErrorMessage(err))
      } finally {
        setLoadingProduct(false)
      }
    }

    loadProduct()
  }, [id, isEditMode])

  function handleChange(field) {
    return (event) => {
      const { value } = event.target

      setForm((prev) => ({
        ...prev,
        [field]: value,
      }))

      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })

      setSubmitError('')
    }
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0] || null

    setForm((prev) => ({
      ...prev,
      image: file,
    }))

    setSubmitError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = validate(form, isEditMode)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    setSubmitError('')

    try {
      const formData = new FormData()
      formData.append('name', form.name.trim())
      formData.append('category', form.category)
      formData.append('unit_price', form.unit_price.trim())

      if (!isEditMode) {
        formData.append('initial_quantity', form.initial_quantity.trim())
        formData.append('initial_price', form.unit_price.trim())
      }

      if (form.image) {
        formData.append('image', form.image)
      }

      if (isEditMode) {
        await updateProduct(id, formData)
        navigate(`/products/${id}`)
      } else {
        const created = await createProduct(formData)
        const newId = created?.product_id ?? created?.id ?? created?.pk
        navigate(newId ? `/products/${newId}` : '/products')
      }
    } catch (err) {
      console.error('Save product error:', err.response?.status, err.response?.data)
      setSubmitError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingProduct) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center text-slate-600 dark:text-slate-300">
        Loading product…
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Link
        to="/products"
        className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
      >
        ← Back to products
      </Link>

      <h1 className="mt-6 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
        {isEditMode ? 'Edit product' : 'Add product'}
      </h1>

      <p className="mt-1 text-slate-600 dark:text-slate-400">
        {isEditMode
          ? 'Admin can update product name, category, price, and image.'
          : 'Admin creates product with unit price, initial stock quantity, and optional image.'}
      </p>

      {submitError ? (
        <div
          className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {submitError}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <Input
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange('name')}
          error={errors.name}
          required
          autoComplete="off"
        />

        <label className="block text-sm">
          <span className="mb-1 block text-slate-700 dark:text-slate-300">
            Category
          </span>

          <select
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            value={form.category}
            onChange={handleChange('category')}
            required
            disabled={loadingCategories || categories.length === 0}
          >
            <option value="">
              {loadingCategories ? 'Loading categories...' : 'Select category'}
            </option>

            {categories.map((category) => (
              <option key={category.category_id} value={String(category.category_id)}>
                {category.name}
              </option>
            ))}
          </select>

          {errors.category ? (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.category}
            </p>
          ) : null}
        </label>

        <Input
          label="Unit Price"
          name="unit_price"
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          value={form.unit_price}
          onChange={handleChange('unit_price')}
          error={errors.unit_price}
          required
        />

        {!isEditMode ? (
          <Input
            label="Initial Quantity"
            name="initial_quantity"
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            value={form.initial_quantity}
            onChange={handleChange('initial_quantity')}
            error={errors.initial_quantity}
            required
          />
        ) : null}

        <Input
          label={isEditMode ? 'Change Product Image (optional)' : 'Product Image'}
          name="image"
          type="file"
          onChange={handleImageChange}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="submit"
            disabled={submitting || loadingCategories || categories.length === 0}
            className="w-full sm:w-auto"
          >
            {submitting
              ? isEditMode
                ? 'Updating…'
                : 'Saving…'
              : isEditMode
                ? 'Update product'
                : 'Create product'}
          </Button>

          <Link to={isEditMode ? `/products/${id}` : '/products'} className="w-full sm:w-auto">
            <Button
              variant="outline"
              type="button"
              className="w-full"
              disabled={submitting}
            >
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}