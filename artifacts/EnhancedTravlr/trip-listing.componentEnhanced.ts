import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  trips: Trip[] = [];

  filteredTrips: Trip[] = [];

  message = '';

  searchText = '';

  // NEW: Controls sorting option
  sortOption = 'nameAsc';


  constructor(
    private tripDataService: TripDataService
  ) {}


  ngOnInit(): void {

    this.loadTrips();

  }


  private loadTrips(): void {

    this.tripDataService.getTrips().subscribe({

      next: (data: Trip[]) => {

        this.trips = data;

        this.filterTrips();

      },

      error: (err) => {

        console.log(err);

        this.message = 'Unable to load trips';

      }

    });

  }



  filterTrips(): void {

    const search = this.searchText.toLowerCase();


    this.filteredTrips = this.trips.filter(trip =>

      trip.name.toLowerCase().includes(search) ||

      trip.resort.toLowerCase().includes(search) ||

      trip.description.toLowerCase().includes(search)

    );


    // Apply sorting after filtering
    this.sortTrips();



    this.message = this.filteredTrips.length

      ? `Showing ${this.filteredTrips.length} of ${this.trips.length} trips.`

      : 'No matching trips found.';

  }




  // NEW: Sorting algorithm enhancement
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



  // Converts price strings into numbers for comparison
  private getPrice(price: string): number {

    return Number(

      price.replace(/[^0-9.]/g, '')

    );

  }




  addTrip(): void {

    // Future enhancement:
    // Navigate to Add Trip component

  }


}