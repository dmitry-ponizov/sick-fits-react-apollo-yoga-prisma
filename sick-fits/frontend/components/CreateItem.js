import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import Router from 'next/router'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import gql from 'graphql-tag'
import Error from './ErrorMessage'

const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $description: String!
        $price: Int!
        $image: String
        $largeImage: String
    ) {
        createItem(
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        ) {
            id 
        }
    }
` 

class CreateItem extends Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0
  }

  handleChange = (e) => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val})
  }

  render() {
    return (
        <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
            {(createItem, { loading, error, called , data}) => (
            <Form onSubmit={async (e) => {
                //Stop form from submitting
                e.preventDefault();
                //Call the mutation
                const res = await createItem()
                // Change them to single item page
                Router.push({
                    pathname: '/item',
                    query: {id: res.data.createItem.id}
                })
            }}>
                <h2>Sell an Item</h2>
                    <Error error={error} />
                    <fieldset disabled={loading} aria-busy={loading} >
                        <label htmlFor="title">
                            Title
                            <input 
                            type="text" 
                            id="title" 
                            name="title" 
                            placeholder="Title" 
                            required
                            value={this.state.title}
                            onChange={this.handleChange}
                            />
                        </label>
                        <label htmlFor="price">
                            Price
                            <input 
                            type="number" 
                            id="price" 
                            name="price" 
                            placeholder="Price" 
                            required
                            value={this.state.price}
                            onChange={this.handleChange}
                            />
                        </label>
                        <label htmlFor="description">
                            Description
                            <textarea 
                                type="text" 
                                id="description" 
                                name="description" 
                                placeholder="Enter A Description" 
                                required
                                value={this.state.description}
                                onChange={this.handleChange} >
                            </textarea>
                        </label>
                        <button type="submit">Submit</button>
                    </fieldset>
            </Form>
            )}
        </Mutation>
    )
  }
} 

export default  CreateItem;
export { CREATE_ITEM_MUTATION };