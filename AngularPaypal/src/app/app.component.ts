import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { IPayPalConfig, NgxPayPalModule } from 'ngx-paypal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgxPayPalModule],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  public payPalConfig?: IPayPalConfig;

  ngOnInit(): void {
    this.initConfig();
  }

  private initConfig(): void {
    this.payPalConfig = {
      clientId: 'AdTd8PcQ7usOBbBlQmLIlkFxuioVlr_YmgqNi5ihkdU6JSiFL8pL9VV5k8T7wZHfqf_JJehcbx26pIPV',
      // for creating orders (transactions) on server see
      // https://developer.paypal.com/docs/checkout/reference/server-integration/set-up-transaction/
      createOrderOnServer: (data: any) => fetch('https://localhost:7157/CreatePayment', {
        method: 'post',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify([
          { name: "Shoe", price: 18, quantity: 2 },
          { name: "Jacket", price: 12, quantity: 1 }
        ])
      })
        .then((res) => res.json())
        .then((order) => order.token),
      authorizeOnServer: (approveData: any) => {
        return fetch('https://localhost:7157/ExecutePayment', {
          method: 'post',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            payerId: approveData.payerID,
            paymentId: approveData.paymentID
          })
        }).then((res) => {
          return res.json();
        }).then((details) => {
          alert('Authorization created for ' + details.payer_given_name);
        });
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
}
