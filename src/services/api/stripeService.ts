/**
 * @file src/services/api/stripeService.ts
 * @description A dedicated module for interacting with the Stripe API.
 * This service encapsulates all Stripe-related functionalities, including payments,
 * subscriptions, customer management, and secure webhook handling. It is designed
to be a comprehensive, secure, and scalable interface to the Stripe platform,
 * incorporating advanced security concepts as placeholders for a full implementation.
 */

import Stripe from 'stripe';
import { config } from '../../config/apiConfig';
import { logger } from '../logging/logger';
import { PQCryptographyService, HomomorphicEncryptionService } from '../security/advancedCryptographyService';

// Define custom types for better readability and maintainability
export interface CreateChargeParams {
  amount: number; // in the smallest currency unit (e.g., cents)
  currency: string;
  source: string; // e.g., 'tok_visa'
  description?: string;
  customer?: string;
  metadata?: { [key: string]: string };
}

export interface CreateSubscriptionParams {
  customerId: string;
  priceId: string;
  metadata?: { [key: string]: string };
  coupon?: string;
}

export interface CreateCustomerParams {
  email: string;
  name?: string;
  payment_method?: string;
  invoice_settings?: {
    default_payment_method?: string;
  };
  metadata?: { [key: string]: string };
}

/**
 * StripeService class to handle all interactions with the Stripe API.
 * It uses the official Stripe Node.js library and is designed to be a singleton.
 */
class StripeApiService {
  private stripe: Stripe;
  private pqcCryptoService: PQCryptographyService;
  private heCryptoService: HomomorphicEncryptionService;
  private apiKey: string;
  private webhookSecret: string;

  constructor() {
    this.apiKey = config.stripe.secretKey;
    this.webhookSecret = config.stripe.webhookSecret;

    if (!this.apiKey) {
      logger.warn('Stripe API key is not configured. StripeService will not function.');
      // @ts-ignore - Allow initialization without a key for environments where it's not used.
      this.stripe = null;
    } else {
      this.stripe = new Stripe(this.apiKey, {
        apiVersion: '2023-10-16',
        typescript: true,
        telemetry: false, // For privacy and performance
      });
    }

    // Initialize advanced cryptography services
    this.pqcCryptoService = new PQCryptographyService();
    this.heCryptoService = new HomomorphicEncryptionService();

    logger.info('StripeApiService initialized.');
  }

  /**
   * Updates the API key and re-initializes the Stripe client.
   * @param newApiKey The new Stripe secret key.
   */
  public setApiKey(newApiKey: string): void {
    if (!newApiKey) {
      throw new Error('A valid Stripe API key must be provided.');
    }
    this.apiKey = newApiKey;
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    });
    logger.info('Stripe API key updated.');
  }

  /**
   * Updates the webhook secret.
   * @param newWebhookSecret The new Stripe webhook signing secret.
   */
  public setWebhookSecret(newWebhookSecret: string): void {
    if (!newWebhookSecret) {
      throw new Error('A valid Stripe webhook secret must be provided.');
    }
    this.webhookSecret = newWebhookSecret;
    logger.info('Stripe webhook secret updated.');
  }

  private checkClient(): void {
    if (!this.stripe) {
      throw new Error('Stripe client is not initialized. Please configure the Stripe API key.');
    }
  }

  // --- Payment Intents ---

  /**
   * Creates a PaymentIntent.
   * @param amount The amount to charge.
   * @param currency The currency of the charge.
   * @param customerId Optional Stripe customer ID.
   * @param paymentMethodId Optional payment method ID.
   * @param metadata Optional metadata, which will be encrypted.
   * @returns The created PaymentIntent object.
   */
  async createPaymentIntent(
    amount: number,
    currency: string,
    customerId?: string,
    paymentMethodId?: string,
    metadata: Record<string, any> = {}
  ): Promise<Stripe.PaymentIntent> {
    this.checkClient();
    try {
      // Placeholder for encrypting sensitive metadata using PQC/HE before sending to Stripe
      const encryptedMetadata = await this.pqcCryptoService.encryptObject(metadata);

      const params: Stripe.PaymentIntentCreateParams = {
        amount,
        currency,
        customer: customerId,
        payment_method: paymentMethodId,
        metadata: encryptedMetadata,
        automatic_payment_methods: { enabled: true },
      };
      const paymentIntent = await this.stripe.paymentIntents.create(params);
      logger.info(`Created PaymentIntent: ${paymentIntent.id}`);
      return paymentIntent;
    } catch (error) {
      logger.error('Error creating Stripe PaymentIntent:', error);
      throw this.handleStripeError(error);
    }
  }

  /**
   * Retrieves a PaymentIntent by its ID.
   * @param paymentIntentId The ID of the PaymentIntent.
   * @returns The PaymentIntent object.
   */
  async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    this.checkClient();
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      logger.info(`Retrieved PaymentIntent: ${paymentIntent.id}`);
      return paymentIntent;
    } catch (error) {
      logger.error(`Error retrieving Stripe PaymentIntent ${paymentIntentId}:`, error);
      throw this.handleStripeError(error);
    }
  }

  // --- Customers ---

  /**
   * Creates a new customer in Stripe.
   * @param params Customer creation parameters.
   * @returns The created Customer object.
   */
  async createCustomer(params: CreateCustomerParams): Promise<Stripe.Customer> {
    this.checkClient();
    try {
      // Encrypt metadata before sending
      const encryptedMetadata = params.metadata
        ? await this.pqcCryptoService.encryptObject(params.metadata)
        : undefined;

      const customer = await this.stripe.customers.create({ ...params, metadata: encryptedMetadata });
      logger.info(`Created Stripe Customer: ${customer.id}`);
      return customer;
    } catch (error) {
      logger.error('Error creating Stripe customer:', error);
      throw this.handleStripeError(error);
    }
  }

  /**
   * Retrieves a customer by their ID.
   * @param customerId The ID of the customer to retrieve.
   * @returns The Customer object.
   */
  async retrieveCustomer(customerId: string): Promise<Stripe.Customer | Stripe.DeletedCustomer> {
    this.checkClient();
    try {
      const customer = await this.stripe.customers.retrieve(customerId);
      logger.info(`Retrieved Stripe Customer: ${customerId}`);
      return customer;
    } catch (error) {
      logger.error(`Error retrieving Stripe customer ${customerId}:`, error);
      throw this.handleStripeError(error);
    }
  }

  // --- Subscriptions ---

  /**
   * Creates a subscription for a customer.
   * @param params Subscription creation parameters.
   * @returns The created Subscription object.
   */
  async createSubscription(params: CreateSubscriptionParams): Promise<Stripe.Subscription> {
    this.checkClient();
    try {
      const encryptedMetadata = params.metadata
        ? await this.pqcCryptoService.encryptObject(params.metadata)
        : undefined;

      const subscription = await this.stripe.subscriptions.create({
        customer: params.customerId,
        items: [{ price: params.priceId }],
        coupon: params.coupon,
        metadata: encryptedMetadata,
        expand: ['latest_invoice.payment_intent'],
      });
      logger.info(`Created Stripe Subscription: ${subscription.id} for Customer: ${params.customerId}`);
      return subscription;
    } catch (error) {
      logger.error('Error creating Stripe subscription:', error);
      throw this.handleStripeError(error);
    }
  }

  /**
   * Cancels a subscription.
   * @param subscriptionId The ID of the subscription to cancel.
   * @returns The canceled Subscription object.
   */
  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    this.checkClient();
    try {
      const subscription = await this.stripe.subscriptions.cancel(subscriptionId);
      logger.info(`Canceled Stripe Subscription: ${subscription.id}`);
      return subscription;
    } catch (error) {
      logger.error(`Error canceling Stripe subscription ${subscriptionId}:`, error);
      throw this.handleStripeError(error);
    }
  }

  /**
   * Lists all subscriptions with optional filters.
   * @param params Parameters for listing subscriptions.
   * @returns A list of Subscription objects.
   */
  async listSubscriptions(params: Stripe.SubscriptionListParams = {}): Promise<Stripe.ApiList<Stripe.Subscription>> {
    this.checkClient();
    try {
      const subscriptions = await this.stripe.subscriptions.list(params);
      logger.info(`Listed ${subscriptions.data.length} Stripe subscriptions.`);
      return subscriptions;
    } catch (error) {
      logger.error('Error listing Stripe subscriptions:', error);
      throw this.handleStripeError(error);
    }
  }

  // --- Products and Prices ---

  /**
   * Creates a new product.
   * @param productData The product data.
   * @returns The created Product object.
   */
  async createProduct(productData: Stripe.ProductCreateParams): Promise<Stripe.Product> {
    this.checkClient();
    try {
      const product = await this.stripe.products.create(productData);
      logger.info(`Created Stripe Product: ${product.id} - ${product.name}`);
      return product;
    } catch (error) {
      logger.error('Error creating Stripe product:', error);
      throw this.handleStripeError(error);
    }
  }

  /**
   * Creates a new price for a product.
   * @param priceData The price data.
   * @returns The created Price object.
   */
  async createPrice(priceData: Stripe.PriceCreateParams): Promise<Stripe.Price> {
    this.checkClient();
    try {
      const price = await this.stripe.prices.create(priceData);
      logger.info(`Created Stripe Price: ${price.id} for Product: ${price.product}`);
      return price;
    } catch (error) {
      logger.error('Error creating Stripe price:', error);
      throw this.handleStripeError(error);
    }
  }

  // --- Webhooks ---

  /**
   * Verifies and constructs a webhook event from a request.
   * This is a critical security step to ensure the webhook is from Stripe.
   * @param payload The raw request body.
   * @param signature The value of the 'stripe-signature' header.
   * @returns The verified Stripe.Event object.
   */
  constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
    this.checkClient();
    if (!this.webhookSecret) {
      logger.error('Stripe webhook secret is not configured. Cannot verify webhook signature.');
      throw new Error('Webhook secret is not configured on the server.');
    }
    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
      logger.info(`Successfully constructed webhook event: ${event.id} of type: ${event.type}`);
      return event;
    } catch (err: any) {
      logger.error('Error verifying Stripe webhook signature:', err.message);
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }
  }

  // --- Error Handling ---

  /**
   * A centralized error handler for Stripe API calls.
   * @param error The error object caught from the Stripe client.
   * @returns A standardized error object.
   */
  private handleStripeError(error: any): Error {
    if (error instanceof Stripe.errors.StripeError) {
      switch (error.type) {
        case 'StripeCardError':
          // A declined card error
          logger.warn(`Stripe Card Error: ${error.message}`, { code: error.code });
          return new Error(`Card Error: ${error.message}`);
        case 'StripeRateLimitError':
          // Too many requests made to the API too quickly
          logger.warn('Stripe Rate Limit Error.', { requestId: error.requestId });
          return new Error('Too many requests. Please try again later.');
        case 'StripeInvalidRequestError':
          // Invalid parameters were supplied to Stripe's API
          logger.error('Stripe Invalid Request Error:', { message: error.message, param: error.param });
          return new Error(`Invalid request: ${error.message}`);
        case 'StripeAPIError':
          // An error occurred internally with Stripe's API
          logger.error('Stripe API Error:', { message: error.message, requestId: error.requestId });
          return new Error('An internal error occurred with our payment processor. Please try again.');
        case 'StripeConnectionError':
          // Some kind of error occurred during the HTTPS communication
          logger.error('Stripe Connection Error:', { message: error.message });
          return new Error('Could not connect to the payment processor. Please check your network connection.');
        case 'StripeAuthenticationError':
          // You probably used an incorrect API key
          logger.error('Stripe Authentication Error: Invalid API key used.');
          return new Error('Authentication with payment processor failed.');
        default:
          // Handle any other types of Stripe errors
          logger.error('An unexpected Stripe error occurred:', { message: error.message });
          return new Error('An unexpected payment error occurred.');
      }
    } else {
      // Non-Stripe error
      logger.error('An unexpected non-Stripe error occurred:', error);
      return new Error('An unexpected error occurred.');
    }
  }
}

// Export a singleton instance of the service
export const stripeService = new StripeApiService();