import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TripCardComponent } from '../trip-card/trip-card.component';
import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, TripCardComponent],
  templateUrl: './trip-listing.component.html'
})
export class TripListingComponent implements OnInit {

  trips: Trip[] = [];
  message = '';

  constructor(private tripDataService: TripDataService) {}

  ngOnInit(): void {
    this.loadTrips();
  }

  private loadTrips(): void {
    this.tripDataService.getTrips().subscribe({
      next: (data: Trip[]) => {
        this.trips = data;

        this.message = data.length
          ? `There are ${data.length} trips available.`
          : 'No trips found';

        console.log('TRIPS LOADED:', data);
      },
      error: (err) => console.log(err)
    });
  }

  addTrip(): void {
    // only used if you wire routing later
  }
}