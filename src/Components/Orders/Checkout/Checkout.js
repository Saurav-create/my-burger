import React, { Component } from 'react';
import { Button, Modal, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import axios from 'axios';
import Spinner from '../../Spinner/Spinner';
import { resetIngredients } from '../../../redux/actionCreators';
import { Formik } from 'formik';





const mapStateToProps = state => {
    return {
        ingredients: state.ingredients,
        totalPrice: state.totalPrice,
        purchaseable: state.purchaseable,
        userId: state.userId,
        token: state.token,
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        resetIngredients: () => dispatch(resetIngredients()),
    }
}


class Checkout extends Component {

    state = {
        values: {
            deliveryAddress: '',
            phone: '',
            paymentType: 'Cash On Delivery',
        },
        isLoading: false,
        isModalOpen: false,
        modalMsg: '',
    }



    goBack = () => {
        this.props.history.goBack('/');
    }

    inputChangeHandler = (e) => {
        this.setState({
            values: {
                ...this.state.values,
                [e.target.name]: e.target.value,
            }
        })
    }


    submitHandler = () => {

        this.setState({
            isLoading: true,
        });
        const order = {
            ingredients: this.props.ingredients,
            customer: this.state.values,
            price: this.props.totalPrice,
            orderTime: new Date(),
            userId: this.props.userId,
        }
        axios.post('https://burger-builder-8d2d5-default-rtdb.firebaseio.com/orders.json?auth=' + this.props.token, order)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        isLoading: false,
                        isModalOpen: true,
                        modalMsg: 'Order Placed Successfully!',
                    });
                    this.props.resetIngredients();
                }
                else {
                    this.setState({
                        isLoading: false,
                        isModalOpen: true,
                        modalMsg: 'Something Went Wrong! Order Again',
                    });
                }
            })
            .catch(err => this.setState({
                isLoading: false,
                isModalOpen: true,
                modalMsg: 'Something Went Wrong! Order Again',
            }));
    }

    render() {

        let form = (<div>
            <h4 style={{
                border: "1px solid grey",
                boxShadow: "1px 1px #888888",
                borderRadius: "5px",
                padding: "20px",
            }}>Payment: {this.props.totalPrice} BDT</h4>
           <Formik
                initialValues={{
                    deliveryAddress: "",
                    phone: "",
                    paymentType: "Cash On Delivery",
                }}
                validate={values => {
                    const errors = {};
                    if (!values.deliveryAddress) {
                        errors.deliveryAddress = 'Required';
                    } 
                    

                    if (!values.phone) {
                        errors.phone = 'Required';
                    } else if (values.phone.length < 11) {
                        errors.password = 'Must be atleast 4 characters!';
                    }

                    // if(errors === null){
                        
                    // }
                    //console.log("Errors:", errors)
                    return errors;
                    
                }}
                onSubmit={(values) => {
                    this.submitHandler(values);
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    /* and other goodies */
                }) => (
                        < form style={{
                            border: "1px solid grey",
                            boxShadow: "1px 1px #888888",
                            borderRadius: "5px",
                            padding: "20px",
                        }} onSubmit={handleSubmit}>
                            <textarea
                                name="deliveryAddress"
                                id="deliveryAddress"
                                value={values.deliveryAddress}
                                className="form-control"
                                placeholder="Your Address"
                                onBlur={handleBlur}
                                onChange={handleChange}
                            ></textarea>
                            <span>{errors.deliveryAddress && touched.deliveryAddress && errors.deliveryAddress}</span>
                            <br />
                            <input name="phone" id="phone" className="form-control" value={values.phone} placeholder="Your Phone Number" onBlur={handleBlur} onChange={handleChange} />
                            <br />
                            <select name="paymentType" id="paymentType" className="form-control" value={values.paymentType} onBlur={handleBlur} onChange={handleChange}>
                                <option value="Cash On Delivery">Cash On Delivery</option>
                                <option value="Bkash">Bkash</option>
                            </select>
                            <br />
                            <Button type="submit" style={{ backgroundColor: "#D70F64" }} className="mr-auto" disabled={false}>Place Order</Button>
                            <Button color="secondary" className="ml-1" onClick={this.goBack}>Cancel</Button>
                        </form>)}
            </Formik>
        </div>)




        return (
            <div>
                {this.state.isLoading ? <Spinner /> : form}
                <Modal isOpen={this.state.isModalOpen} onClick={this.goBack}>
                    <ModalBody>
                        <p>{this.state.modalMsg}</p>
                    </ModalBody>

                </Modal>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);