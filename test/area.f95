!Description: Program to calculate the area of a circle
program CircleAreaCalculator
implicit none !Enforce explicit variable declaration
!Variable Declaration
real:: radius, area
real, parameter:: pi = 3.1415926533 !Define a constant for pi
!Prompt user for input
print *, "Enter the radius of the circle!"
read *, radius
!Calculation
area = pi * radius * radius
!Output the result
print *, "radius = ", radius
print *, "Area = ", area 
end program CircleAreaCalculator