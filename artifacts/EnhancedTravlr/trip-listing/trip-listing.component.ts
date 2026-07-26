import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TripCardComponent } from '../trip-card/trip-card.component';
import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data.service';


@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TripCardComponent
  ],
  templateUrl: './trip-listing.component.html'
})
export class TripListingComponent implements OnInit {


  // Stores all trips retrieved from database
  trips: Trip[] = [];


  // Stores filtered/sorted results displayed to user
  filteredTrips: Trip[] = [];


  // User feedback messages
  message = '';


  // Search input value
  searchText = '';


  // Default sorting option
  sortOption = 'nameAsc';



  constructor(
    private tripDataService: TripDataService,
    private router: Router
  ) {}



  ngOnInit(): void {

    this.loadTrips();

  }




  /*
    Retrieves trip data from the backend API.

    Flow:
    Angular Component
          |
          |
    TripDataService
          |
          |
    Express API
          |
          |
    MongoDB Database
  */
  private loadTrips(): void {


    this.tripDataService.getTrips().subscribe({


      next: (data: Trip[]) => {


        this.trips = data;


        // Apply filtering and sorting
        this.filterTrips();


      },


      error: (err) => {


        console.log(err);


        this.message = 
        'Unable to load trips from server';


      }


    });


  }





  /*
    Search algorithm enhancement.

    Filters trips based on:
    - Trip name
    - Resort location
    - Description

    This improves usability by allowing administrators
    to quickly locate specific travel packages.
  */
  filterTrips(): void {


    const search = this.searchText.toLowerCase();



    this.filteredTrips = this.trips.filter(trip =>


      trip.name.toLowerCase().includes(search) ||


      trip.resort.toLowerCase().includes(search) ||


      trip.description.toLowerCase().includes(search)


    );



    // Sort filtered results
    this.sortTrips();




    this.message = this.filteredTrips.length


      ? `Showing ${this.filteredTrips.length} of ${this.trips.length} trips.`


      : 'No matching trips found.';



  }







  /*
    Sorting algorithm enhancement.

    Allows administrators to organize trips by:

    - Alphabetical order
    - Reverse alphabetical order
    - Lowest price
    - Highest price

  */
  sortTrips(): void {



    switch(this.sortOption) {



      case 'nameAsc':

        this.filteredTrips.sort((a, b) =>

          a.name.localeCompare(b.name)

        );

        break;




      case 'nameDesc':

        this.filteredTrips.sort((a, b) =>

          b.name.localeCompare(a.name)

        );

        break;




      case 'priceLow':

        this.filteredTrips.sort((a, b) =>

          this.getPrice(a.perPerson) -

          this.getPrice(b.perPerson)

        );

        break;




      case 'priceHigh':

        this.filteredTrips.sort((a, b) =>

          this.getPrice(b.perPerson) -

          this.getPrice(a.perPerson)

        );

        break;


    }


  }






  /*
    Converts stored price strings into numbers.

    Example:
    "$1,200" becomes 1200

    This allows numerical comparisons
    during sorting operations.
  */
  private getPrice(price: string): number {


    return Number(

      price.replace(/[^0-9.]/g, '')

    );


  }







  /*
    Navigation enhancement.

    Opens the Add Trip form allowing
    administrators to create new travel packages.
  */
  addTrip(): void {


    this.router.navigate(['/add-trip']);


  }



}