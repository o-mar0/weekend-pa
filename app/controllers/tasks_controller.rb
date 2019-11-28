class TasksController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index]
  before_action :find_task, only: %i[show edit destroy]
  before_action :find_category, only: %i[create]

  def index
    @tasks = Task.all.select { |task| task.user == current_user }
    @tasks_categories = {}
    @tasks.each do |task|
      if @tasks_categories.include? task.category.label
        @tasks_categories[task.category.label].push(task)
      else
        @tasks_categories[task.category.label] = [task]
      end
    end
  end

  def show
    # @task = Task.find(params[:id])
  end

  def new
    @task = Task.new
  end

  def create
    @task = Task.new(task_params)
    @task.user = current_user
    @task.category = @category
    if @task.save
      redirect_to tasks_path
    else
      render :new
    end
  end

  def edit
    # @task = Task.find(params[:id])
  end

  def update
    if @task.update
      redirect_to
    else
      render :edit
    end
  end

  def destroy
    # @task = Task.find(params[:id])
    @task.destroy
  end

  def mission_builder

    user_lat = params[:lat].to_f.round(2)
    user_long = params[:long].to_f.round(2)

    @tasks = Task.all.select { |task| task.user == current_user }
    @tasks = Task.near([user_lat, user_long], 10)



    # Hash - all the user tasks(array - vlaue of keys) categorised(keys)
    # @tasks_categories = {}
    # @tasks.each do |task|
    #   if @tasks_categories.include? task.category.label
    #     @tasks_categories[task.category.label].push(task)
    #   else
    #     @tasks_categories[task.category.label] = [task]
    #   end
    # end

    # # generate new array with tasks that can be achieved today
    # # Array - all the tasks with todays date & flexible tasks
    # @todays_tasks = @tasks.select do |task|
    #   task.start_at.day == Date.today || task.start_at.nil?
    # end
    # @todays_tasks = Task.geocoded

    # # sort todays_tasks by priority
    # # priority: Time first > Location to user second > Category last
    # # return sorted tasks from today
    # @prioritirised = @todays_tasks.each do |task|
    #   if task.start_at

    #     # fetch tasks with todays date --> array

    #   elsif task.location

    #   else

    #   end
    #   # sort first by time, location
    # end

  end

  private

  def find_task
    @task = Task.find(params[:id])
  end

  def find_category
    @category = Category.find(params[:task][:category_id])
  end

  def task_params
    params.require(:task).permit(:title, :location, :start_at, :end_at, :due, :category)
  end
end
